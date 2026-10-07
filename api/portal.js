import { config, currentUser, error, getBusiness, isAdmin, json } from "../lib/server.js";

export default async function handler(req, res) {
  if (!["GET","PATCH"].includes(req.method)) return json(res, 405, { error: "Method not allowed." });
  try {
    const db = config(), user = await currentUser(req, db);
    if (!user || !user.email_confirmed_at) return json(res, 401, { error: "Please sign in with a verified email." });
    const admin = isAdmin(user);
    if (req.method === "PATCH") {
      if (!admin) return json(res, 403, { error: "Access denied." });
      const id = req.body?.id, status = req.body?.status;
      const statuses = ["new","contacted","demo_booked","pilot","closed_won","closed_lost"];
      if (!/^[0-9a-f-]{36}$/i.test(String(id)) || !statuses.includes(status))
        return json(res, 400, { error: "Invalid inquiry or status." });
      const { data, error: updateError } = await db.from("demo_inquiries").update({ status }).eq("id", id).select("id").single();
      if (updateError) throw updateError;
      return json(res, 200, { updated: Boolean(data) });
    }
    const business = await getBusiness(db, user);
    let calls = [], appointments = [], inquiries = [];
    if (business) {
      const [cr, ar] = await Promise.all([
        db.from("calls").select("id,caller_number,started_at,created_at,duration_seconds,summary").eq("business_id", business.id).order("created_at", { ascending:false }).limit(100),
        db.from("appointments").select("id,customer_name,starts_at,status").eq("business_id", business.id).order("starts_at", { ascending:false }).limit(100),
      ]);
      if (cr.error) throw cr.error; if (ar.error) throw ar.error;
      calls = cr.data || []; appointments = ar.data || [];
    }
    if (admin) {
      const { data, error: qError } = await db.from("demo_inquiries")
        .select("id,contact_name,business_name,email,phone,city,call_volume,notes,status,created_at")
        .order("created_at", { ascending:false }).limit(100);
      if (qError) throw qError; inquiries = data || [];
    }
    // Never expose private service keys, IP hashes or raw webhook contents.
    const publicBusiness = business && Object.fromEntries([
      "id", "name", "phone_number", "retell_agent_id", "cal_event_type_id",
      "stripe_customer_id", "subscription_status",
    ].map(k => [k, business[k]]));
    return json(res, 200, { admin, business: publicBusiness, calls, appointments, ...(admin ? { inquiries } : {}) });
  } catch (e) { return error(res, e); }
}
