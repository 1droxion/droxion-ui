import { createHmac, timingSafeEqual } from "node:crypto";
import { config as dbClient, text } from "../../lib/server.js";

const reply = (status, obj) => Response.json(obj, { status, headers: { "Cache-Control": "no-store" } });

export function verifyRetell(body, signature, secret, now = Date.now()) {
  if (!secret || typeof signature !== "string" || typeof body !== "string") return false;
  const match = /^v=(\d+),d=([a-f0-9]{64})$/i.exec(signature);
  if (!match) return false;
  const [, timestamp, digest] = match;
  if (Math.abs(now - Number(timestamp)) > 300000) return false;
  const expected = createHmac("sha256", secret).update(body + timestamp).digest("hex");
  const a = Buffer.from(expected, "hex"), b = Buffer.from(digest, "hex");
  return a.length === b.length && timingSafeEqual(a,b);
}

// Native Vercel Web Request retains original bytes for signature verification.
export async function POST(request) {
  if (!process.env.RETELL_API_KEY) return reply(503, { error: "Webhook not configured." });
  let raw;
  try { raw = await request.text(); } catch { return reply(400, { error: "Invalid request body." }); }
  if (!verifyRetell(raw, request.headers.get("x-retell-signature"), process.env.RETELL_API_KEY))
    return reply(401, { error: "Invalid signature." });
  let payload;
  try { payload = JSON.parse(raw); } catch { return reply(400, { error: "Invalid payload." }); }
  if (payload.event !== "call_analyzed" || !payload.call?.agent_id || !payload.call?.call_id)
    return reply(200, { ok: true });
  try {
    const call = payload.call, db = dbClient();
    const { data: business, error: lookupError } = await db.from("businesses")
      .select("id").eq("retell_agent_id",call.agent_id).maybeSingle();
    if (lookupError) throw lookupError;
    if (!business) return reply(200, { ok: true });
    const ts = call.start_timestamp;
    const started = typeof ts === "number" && Number.isFinite(ts) && ts > 0 ? new Date(ts).toISOString() : null;
    const duration = Number.isFinite(call.duration_ms) ? call.duration_ms / 1000 :
      (Number.isFinite(call.end_timestamp) && Number.isFinite(ts)
      ? Math.max(0,(call.end_timestamp-ts)/1000):0);
    const { error: saveError } = await db.from("calls").upsert({
      retell_call_id:call.call_id,business_id:business.id,caller_number:text(call.from_number,50)||null,
      started_at:started,duration_seconds:Math.max(0,Math.round(duration)),
      summary:text(call.call_analysis?.call_summary,3000),
    }, { onConflict:"retell_call_id" });
    if (saveError) throw saveError;
    return reply(200, { ok: true });
  } catch (err) {
    console.error("Retell webhook storage error",err?.message);
    return reply(500, { error: "Storage failed." });
  }
}
