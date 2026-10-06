import { config, error, json, parsePayload, rawBody, text, verifyCal } from "../../lib/server.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
  if (!verifyCal(rawBody(req), req.headers["x-cal-signature-256"], process.env.CAL_WEBHOOK_SECRET))
    return json(res, 401, { error: "Invalid signature." });
  const input = parsePayload(req);
  const trigger = input?.triggerEvent, p = input?.payload;
  if (!["BOOKING_CREATED","BOOKING_RESCHEDULED","BOOKING_CANCELLED"].includes(trigger) || !p)
    return json(res, 200, { ok: true });
  const id = p.uid, eventId = p.eventTypeId ?? p.eventType?.id;
  if (typeof id !== "string" || !Number.isSafeInteger(Number(eventId))) return json(res, 200, { ok:true });
  try {
    const db = config();
    const { data: business, error: findError } = await db.from("businesses")
      .select("id").eq("cal_event_type_id", Number(eventId)).maybeSingle();
    if (findError) throw findError;
    if (!business) return json(res, 200, { ok:true });
    const attendee = p.attendees?.[0] || {};
    const row = {
      business_id: business.id, cal_booking_uid: id,
      customer_name: text(attendee.name, 160) || "Customer",
      starts_at: p.startTime || p.start || null,
      status: trigger === "BOOKING_CANCELLED" ? "cancelled" : "confirmed",
    };
    if (!row.starts_at || Number.isNaN(Date.parse(row.starts_at))) return json(res, 200, { ok:true });
    const { error: saveError } = await db.from("appointments").upsert(row, { onConflict:"cal_booking_uid" });
    if (saveError) throw saveError;
    return json(res, 200, { ok:true });
  } catch (e) { return error(res, e); }
}
