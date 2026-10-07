import { config as dbClient, text, verifyCal } from "../../lib/server.js";
const reply = (status, obj) => Response.json(obj, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  if (!process.env.CAL_WEBHOOK_SECRET) return reply(503, { error: "Webhook not configured." });
  let raw;
  try { raw = await request.text(); } catch { return reply(400, { error: "Invalid request body." }); }
  if (!verifyCal(raw,request.headers.get("x-cal-signature-256"),process.env.CAL_WEBHOOK_SECRET))
    return reply(401, { error: "Invalid signature." });
  let payload;
  try { payload = JSON.parse(raw); } catch { return reply(400, { error: "Invalid payload." }); }
  const event = payload.triggerEvent,p = payload.payload;
  if (!["BOOKING_CREATED","BOOKING_RESCHEDULED","BOOKING_CANCELLED"].includes(event) || !p)
    return reply(200, { ok:true });
  const uid = p.uid, typeId = Number(p.eventTypeId ?? p.eventType?.id);
  if (typeof uid !== "string" || uid.length > 255 || !Number.isSafeInteger(typeId))
    return reply(200, { ok:true });
  try {
    const db = dbClient();
    const { data: business, error: lookupError } = await db.from("businesses")
      .select("id").eq("cal_event_type_id",typeId).maybeSingle();
    if (lookupError) throw lookupError;
    if (!business) return reply(200, { ok:true });
    const starts = p.startTime || p.start || null;
    if (!starts || Number.isNaN(Date.parse(starts))) return reply(200, { ok:true });
    const { error: saveError } = await db.from("appointments").upsert({
      business_id:business.id,cal_booking_uid:uid,
      customer_name:text(p.attendees?.[0]?.name,160)||"Customer",
      starts_at:starts,
      status:event==="BOOKING_CANCELLED"?"cancelled":"confirmed",
    }, { onConflict:"cal_booking_uid" });
    if (saveError) throw saveError;
    return reply(200, { ok:true });
  } catch(err) {console.error("Cal webhook storage error",err?.message);return reply(500,{error:"Storage failed."});}
}
