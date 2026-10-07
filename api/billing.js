import Stripe from "stripe";
import { config, currentUser, error, getBusiness, json } from "../lib/server.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error:"Method not allowed." });
  try {
    const db = config(), user = await currentUser(req, db);
    if (!user || !user.email_confirmed_at) return json(res, 401, { error:"Sign in with a verified email." });
    const business = await getBusiness(db, user);
    if (!business) return json(res, 403, { error:"Complete onboarding before billing." });
    if (!process.env.STRIPE_SECRET_KEY || !process.env.PUBLIC_SITE_URL) 
      return json(res, 503, { error:"Billing is not configured yet. Contact support." });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const action = req.body?.action;
    if (action === "portal") {
      if (!business.stripe_customer_id) return json(res, 400, { error:"No billing account is linked yet." });
      const session = await stripe.billingPortal.sessions.create({
        customer: business.stripe_customer_id, return_url: process.env.PUBLIC_SITE_URL + "/dashboard",
      });
      return json(res, 200, { url: session.url });
    }
    if (action !== "checkout") return json(res, 400, { error:"Unknown billing request." });
    if (business.stripe_customer_id || ["active","trialing","past_due"].includes(business.subscription_status))
      return json(res, 409, { error:"Billing already exists. Contact support." });
    if (business.onboarding_approved !== true) return json(res, 403, { error:"We must test your receptionist and confirm terms before payment." });
    if (!process.env.STRIPE_MONTHLY_PRICE_ID || !process.env.STRIPE_SETUP_PRICE_ID)
      return json(res, 503, { error:"Payment prices are not configured." });
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription", customer_email: user.email,
      line_items: [
        { price: process.env.STRIPE_MONTHLY_PRICE_ID, quantity: 1 },
        { price: process.env.STRIPE_SETUP_PRICE_ID, quantity: 1 },
      ],
      client_reference_id: business.id,
      metadata: { business_id: business.id },
      subscription_data: { metadata: { business_id: business.id } },
      success_url: process.env.PUBLIC_SITE_URL + "/dashboard?checkout=success",
      cancel_url: process.env.PUBLIC_SITE_URL + "/dashboard?checkout=cancelled",
    });
    return json(res, 200, { url: checkout.url });
  } catch(e) { return error(res, e); }
}
