import { config, error, hashIp, json, parsePayload, text } from "../lib/server.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
  const input = parsePayload(req);
  if (!input) return json(res, 400, { error: "Invalid request." });
  // Honeypot: silently discard bot form submissions.
  if (input.website2) return json(res, 200, { ok: true });
  const contact = text(input.contact_name, 160), name = text(input.business_name, 160);
  const email = text(input.email, 240).toLowerCase(), phone = text(input.phone, 40);
  const city = text(input.city, 160), notes = text(input.notes, 1000);
  if (!contact || !name || !city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^[+()\d\s.-]{7,40}$/.test(phone) || input.consent !== true) {
    return json(res, 400, { error: "Please fill in valid details and agree to contact." });
  }
  try {
    const db = config(), ip_hash = hashIp(req);
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count, error: countError } = await db.from("demo_inquiries")
      .select("*", { count: "exact", head: true }).eq("ip_hash", ip_hash).gte("created_at", since);
    if (countError) throw countError;
    if (count >= 5) return json(res, 429, { error: "Too many requests. Try again later." });
    const { error: insertError } = await db.from("demo_inquiries").insert({
      contact_name: contact, business_name: name, email, phone, city,
      call_volume: ["Under 10 per day", "10–30 per day", "30–100 per day", "Over 100 per day"].includes(input.call_volume) ? input.call_volume : "Not specified",
      notes, ip_hash, status: "new", consent_at: new Date().toISOString(),
    });
    if (insertError) throw insertError;
    // The database is the authoritative sales inbox. Never falsely claim an email was sent.
    return json(res, 200, { ok: true });
  } catch (e) {
    if (/fetch failed|could not connect/i.test(String(e?.message || ""))) {
      const target = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      try {
        const host = new URL(target).hostname;
        const { lookup } = await import("node:dns/promises");
        try {
          await lookup(host);
          console.error("[Droxion connectivity diagnostic]", { host, dns: "resolved", supabaseErrorCode: e?.code || "unknown" });
        } catch (dnsError) {
          console.error("[Droxion connectivity diagnostic]", { host, dns: dnsError?.code || "failed" });
        }
      } catch {
        console.error("[Droxion connectivity diagnostic] Invalid or missing Supabase URL");
      }
    }
    return error(res, e);
  }
}
