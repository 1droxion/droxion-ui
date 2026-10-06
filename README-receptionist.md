# Droxion — AI Receptionist (sales-first MVP)

This is a **pivot in progress** built from the original droxion-ui repository, NOT from droxion-live-final (which currently hosts the fitness product). Its public homepage and demo form are intended to capture *real potential customers*. All dashboard metrics are database-grounded; no fabricated calls, clients, or testimonials.

## Local setup
1. Run \`npm install\`, then \`npm run dev\`. The website UI can render without keys but the demo form and sign-in need Vercel functions and Supabase.
2. Create a Supabase project, open SQL Editor, and run \`supabase/receptionist.sql\`.
3. Set frontend environment values \`VITE_SUPABASE_URL\`, \`VITE_SUPABASE_ANON_KEY\`.
4. Configure server-side environment variables in Vercel: \`SUPABASE_URL\`, \`SUPABASE_SERVICE_ROLE_KEY\`, \`DROXION_ADMIN_EMAIL\`, \`RATE_LIMIT_SALT\`, \`PUBLIC_SITE_URL\`.
5. Deploy on Vercel (serverless \`api/\` paths), or use \`vercel dev\` to test serverless locally. Set Supabase email auth redirect URL to \`https://YOUR_DOMAIN/dashboard\`. Supabase confirmation requires a configured email provider for reliable delivery.
6. Set admin email to your verified Supabase login email. The demo form writes into the server's database, visible in the admin Sales Inbox after login. The admin address is server-only.

## Retell/Cal.com integration (do this before live calls)
- Create a Retell phone agent and number under your own account. Confirm transfer behavior, legal disclosures, emergency handling and operational support.
- Set \`RETELL_API_KEY\` on Vercel. Point Retell's **call_analyzed** webhook at \`https://YOUR_DOMAIN/api/webhooks/retell\`; only signed payloads are accepted.
- In Supabase businesses, link the *correct verified owner ID* with the corresponding \`retell_agent_id\`, and add the actual business phone number. Never give shared agents to multiple businesses.
- Create a dedicated Cal.com event type for each business, connect it to Retell's booking tools and calendar, and link \`cal_event_type_id\` in Supabase.
- Set \`CAL_WEBHOOK_SECRET\` (nonempty strong random value). Configure a standard Cal.com webhook signed with that secret for BOOKING_CREATED/RESCHEDULED/CANCELLED, targeting \`https://YOUR_DOMAIN/api/webhooks/cal\`. Avoid custom payload templates until validated.
- Test incoming calls and one booked, rescheduled and canceled appointment per business; ensure call recording consent notices, privacy policy, staff notification, opt-outs, and handoff rules are verified.
- Dashboard shows up to 100 recent call records and up to 100 appointments; counts are NOT all-time totals. Do not claim all-time stats.

## Stripe — billing is gated, not automatic
- Create Stripe products/prices **$499/mo recurring** and **$500 one-time onboarding**. Confirm voice minutes and overage pricing in the agreement.
- Set \`STRIPE_SECRET_KEY\`, \`STRIPE_MONTHLY_PRICE_ID\`, \`STRIPE_SETUP_PRICE_ID\`, \`STRIPE_WEBHOOK_SECRET\` in Vercel; create webhook destination at \`https://YOUR_DOMAIN/api/webhooks/stripe\` for checkout.session.completed, customer.subscription.updated and deleted.
- Enable Stripe customer portal and verify a test-mode subscription lifecycle. The Checkout button is disabled server-side until \`businesses.onboarding_approved = true\` is set manually after successful live integration tests and a customer agreement.
- Never place secret keys in frontend variables, screenshots, or commits.

## Critical safety and operations before public launch
- Set your domain, valid business contact and legal documents; the MVP currently does NOT include dedicated privacy, terms, refund, voice recordings, data retention or call-consent pages. Publish and review them before live capture or customer activation.
- Inspect or rotate any historic secrets accidentally committed to droxion-ui and droxion-backend (legacy \`.env\` files were found tracked in GitHub). Move all secrets into provider environment settings. Historic commits may retain those secrets, so deletion alone is insufficient.
- Verify phone forwarding, availability conflicts, fail-open to human/voicemail, abuse limits, business-hours routing, dropped call recovery, and billing metering.
- Demo form uses DB-backed IP throttling and honeypot, not CAPTCHA. Install bot protection before a broad outreach campaign.
- No customers, production calls, billing or deployment are claimed until services are configured, verified and tested. Avoid representing illustrative website workflows as real customer activity.

## First sales objective
Contact 50 local HVAC service companies with a specific *answer missed calls and capture bookings* offer. Record responses in the Sales Inbox, run three real demonstrations, convert three paid pilot customers **only after verifying technical reliability and terms**. Do not spend weeks on secondary features before pilots.
