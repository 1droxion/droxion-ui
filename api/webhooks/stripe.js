import Stripe from "stripe";
import { config as dbClient, error, json } from "../../lib/server.js";

// Preserve the exact bytes used in Stripe's signature: parsed JSON is NOT safe for verification.
export const config = { api: { bodyParser: false } };
async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body);
  if (req.body && typeof req.body === "object") throw new Error("Webhook body was already parsed.");
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error:"Method not allowed." });
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY)
    return json(res, 503, { error:"Billing not configured." });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;
  try {
    const body = await readBody(req);
    event = stripe.webhooks.constructEvent(body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch { return json(res, 401, { error:"Invalid webhook or body signature." }); }
  try {
    const db = dbClient(), obj = event.data.object;
    if (event.type === "checkout.session.completed" && obj.mode === "subscription" && obj.payment_status !== "unpaid") {
      const id = obj.client_reference_id;
      if (id) {
        const { error: updateError } = await db.from("businesses")
          .update({ stripe_customer_id: String(obj.customer), stripe_subscription_id: String(obj.subscription), subscription_status: "active" })
          .eq("id", id).eq("onboarding_approved", true);
        if (updateError) throw updateError;
      }
    }
    if (["customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      const statuses = ["active","trialing","past_due","canceled","unpaid","incomplete","incomplete_expired","paused"];
      const status = statuses.includes(obj.status) ? obj.status : "unknown";
      const { error: updateError } = await db.from("businesses")
        .update({ subscription_status: status })
        .eq("stripe_subscription_id", obj.id);
      if (updateError) throw updateError;
    }
    return json(res, 200, { received:true });
  } catch(e) { return error(res, e); }
}
