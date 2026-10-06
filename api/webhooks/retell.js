import { createHmac, timingSafeEqual } from "node:crypto";
import { config as dbConfig, error, json, parsePayload, signedBody, text } from "../../lib/server.js";

// Verify Retell's timestamped HMAC over raw payload+timestamp.
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

export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
  if (!process.env.RETELL_API_KEY) return json(res, 503, { error: "Webhook not configured." });
  let original;
  try { original = await signedBody(req); } catch { return json(res, 400, { error: "Invalid body." }); }
  if (!verifyRetell(original, req.headers["x-retell-signature"], process.env.RETELL_API_KEY))
    return json(res, 401, { error: "Invalid signature." });
  let body;
  try { body = JSON.parse(original); } catch { return json(res, 400, { error: "Invalid payload." }); }
  if (!body?.call || body.event !== "call_analyzed") return json(res, 200, { ok: true });
  const call = body.call;
  if (!call.call_id || !call.agent_id) return json(res, 200, { ok: true });
  try {
    const db = dbConfig();
    const { data: business, error: findError } = await db.from("businesses")
      .select("id").eq("retell_agent_id", call.agent_id).maybeSingle();
    if (findError) throw findError;
    if (!business) return json(res, 200, { ok: true });
    const started = typeof call.start_timestamp === "number" ? new Date(call.start_timestamp).toISOString() : null;
    const duration = Number.isFinite(call.duration_ms) ? call.duration_ms / 1000 :
      (Number.isFinite(call.end_timestamp) && Number.isFinite(call.start_timestamp)
        ? Math.max(0, (call.end_timestamp - call.start_timestamp) / 1000) : 0);
    const { error: saveError } = await db.from("calls").upsert({
      retell_call_id: call.call_id, business_id: business.id,
      caller_number: text(call.from_number, 50) || null,
      started_at: started, duration_seconds: Math.max(0, Math.round(duration)),
      summary: text(call.call_analysis?.call_summary, 3000),
    }, { onConflict: "retell_call_id" });
    if (saveError) throw saveError;
    return json(res, 200, { ok: true });
  } catch (e) { return error(res, e); }
}
