import Stripe from "stripe";
import { config as dbClient } from "../../lib/server.js";
const reply = (status, obj) => Response.json(obj, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY)
    return reply(503,{error:"Billing is not configured."});
  let event;
  try {
    const raw = await request.text();
    event = new Stripe(process.env.STRIPE_SECRET_KEY).webhooks.constructEvent(
      raw,request.headers.get("stripe-signature"),process.env.STRIPE_WEBHOOK_SECRET);
  } catch { return reply(401,{error:"Invalid signature."}); }
  try {
    const db=dbClient(), obj=event.data.object;
    if(event.type==="checkout.session.completed" && obj.mode==="subscription" && obj.payment_status!=="unpaid") {
      const id=obj.client_reference_id;
      if(id && obj.customer && obj.subscription) {
        const {error:saveError}=await db.from("businesses").update({
          stripe_customer_id:String(obj.customer),
          stripe_subscription_id:String(obj.subscription),subscription_status:"active",
        }).eq("id",id).eq("onboarding_approved",true);
        if(saveError)throw saveError;
      }
    }
    if(["customer.subscription.updated","customer.subscription.deleted"].includes(event.type)) {
      const statuses=["active","trialing","past_due","canceled","unpaid","incomplete","incomplete_expired","paused"];
      const status=statuses.includes(obj.status)?obj.status:"unknown";
      const {error:saveError}=await db.from("businesses").update({subscription_status:status})
        .eq("stripe_subscription_id",obj.id);
      if(saveError)throw saveError;
    }
    return reply(200,{received:true});
  } catch(err) {console.error("Stripe webhook storage error",err?.message);return reply(500,{error:"Storage failed."});}
}
