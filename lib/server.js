import { createClient } from "@supabase/supabase-js";
import { normalizeSupabaseUrl } from "./supabase-url.js";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export function config() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(normalizeSupabaseUrl(url), key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export function json(res, status, payload) { return res.status(status).setHeader("Cache-Control", "no-store").json(payload); }
export function error(res, e) {
  console.error("[Droxion server]", e?.message || e);
  return json(res, 500, { error: "Request could not be processed. Please contact support." });
}
export function text(s, max = 200) { return typeof s === "string" ? s.trim().slice(0, max) : ""; }
export function rawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  if (typeof req.body === "string") return req.body;
  return JSON.stringify(req.body ?? {});
}
export function verifyCal(body, signature, secret) {
  if (!secret || typeof signature !== "string") return false;
  const actual = createHmac("sha256", secret).update(body).digest("hex");
  const expected = "sha256=" + actual;
  const a = Buffer.from(expected), b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function parsePayload(req) {
  try { return typeof req.body === "string" || Buffer.isBuffer(req.body) ? JSON.parse(rawBody(req)) : (req.body || {}); }
  catch { return null; }
}
export async function currentUser(req, db) {
  const token = /Bearer\s+(.+)/i.exec(req.headers.authorization || "")?.[1];
  if (!token) return null;
  const { data, error } = await db.auth.getUser(token);
  return error ? null : data?.user;
}
export function isAdmin(user) {
  return Boolean(user && user.email_confirmed_at && process.env.DROXION_ADMIN_EMAIL &&
    user.email?.toLowerCase() === process.env.DROXION_ADMIN_EMAIL.toLowerCase());
}
export function hashIp(req) {
  const first = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  return createHash("sha256").update(first + ":" + (process.env.RATE_LIMIT_SALT || "droxion")).digest("hex");
}
export async function getBusiness(db, user) {
  const { data, error } = await db.from("businesses").select("*").eq("owner_user_id", user.id).maybeSingle();
  if (error) throw error;
  return data;
}

/** Webhooks must verify original bytes; never verify re-serialized parsed JSON. */
export async function signedBody(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString("utf8");
  if (typeof req.rawBody === "string") return req.rawBody;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  if (typeof req.body === "string") return req.body;
  if (req.body != null) throw new Error("Signed body was already parsed before verification.");
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}
