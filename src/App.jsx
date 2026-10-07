import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { normalizeSupabaseUrl } from "../lib/supabase-url.js";
import {
  ArrowRight, BellRing, CalendarDays, Check, CheckCircle2, Clock3, Headphones,
  LogOut, Menu, Phone, PhoneCall, PhoneMissed, ShieldCheck, Sparkles, TrendingUp, X,
} from "lucide-react";
import "./receptionist.css";

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;
try {
  if (URL && KEY) supabase = createClient(normalizeSupabaseUrl(URL), KEY);
} catch (err) {
  console.error("[Droxion] Invalid public Supabase Project URL configuration.");
}
const CONTACT_EMAIL = "patelsuchitbhai@gmail.com";
const fields = [
  { key: "contact_name", label: "Your name", placeholder: "Alex Smith", required: true },
  { key: "business_name", label: "Business name", placeholder: "Smith Heating & Air", required: true },
  { key: "email", label: "Business email", placeholder: "alex@company.com", type: "email", required: true },
  { key: "phone", label: "Phone number", placeholder: "(662) 555-0100", type: "tel", required: true },
  { key: "city", label: "Business location", placeholder: "Tupelo, MS", required: true },
];

async function request(path, token, method = "GET", body) {
  const response = await fetch(path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function Header({ dark = false }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={"site-header" + (dark ? " header-dark" : "")}>
      <div className="site-container header-inner">
        <Link to="/" className="brand" aria-label="Droxion homepage"><span className="brand-mark"><PhoneCall size={19} /></span>Droxion<span className="brand-dot">.</span></Link>
        <nav className={open ? "top-nav nav-open" : "top-nav"} aria-label="Main navigation">
          <Link to="/#how" onClick={() => setOpen(false)}>How it works</Link>
          <Link to="/#pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/login" onClick={() => setOpen(false)}>Client login</Link>
          <Link className="button button-dark" to="/demo" onClick={() => setOpen(false)}>Get a live demo <ArrowRight size={15} /></Link>
        </nav>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

function Home() {
  const [faq, setFaq] = useState(0);
  const questions = [
    ["Will this replace my business phone number?", "Not necessarily. During setup we help configure a dedicated number or an appropriate call-forwarding flow. We test routing together before going live."],
    ["Can it really book appointments?", "Yes, after your calendar and service availability are connected. We test real scheduling and human handoffs for your business before activation."],
    ["What if a caller needs a real person?", "We configure escalation and transfer rules for urgent, complex, or uncertain requests. AI is not an emergency dispatch service."],
    ["Is there a contract?", "Pricing and usage limits are confirmed in writing before onboarding. Request a demo for the current service terms."],
  ];
  return (
    <div className="public-page">
      <Header />
      <main>
        <section className="hero">
          <div className="site-container hero-layout">
            <div>
              <div className="eyebrow"><span className="pulse-dot" /> AI phone answering for service businesses</div>
              <h1>Every missed call could be a <span>missed customer.</span></h1>
              <p className="hero-copy">Meet Droxion, your AI front desk. Answer incoming calls after hours, capture job requests, and book service appointments — even when your team is busy.</p>
              <div className="hero-cta"><Link to="/demo" className="button button-accent">See a live demo <ArrowRight size={18} /></Link><a href="#how" className="text-link">See how it works <ArrowRight size={17} /></a></div>
              <p className="subtle-note"><ShieldCheck size={16} /> Built for real service calls. Human handoff when needed.</p>
            </div>
            <div className="hero-panel" aria-label="Illustration of an AI receptionist call">
              <div className="window-title"><div><span /><span /><span /></div><small>ILLUSTRATIVE WORKFLOW — NOT LIVE DATA</small></div>
              <div className="incoming-label"><span className="live-circle"><PhoneCall size={17} /></span><div><strong>Incoming customer call</strong><small>HVAC service request</small></div><span className="status-indicator">ANSWERED</span></div>
              <div className="conversation">
                <div className="speech incoming">“My AC stopped cooling. Can someone come tomorrow?”</div>
                <div className="speech outgoing"><span className="bot-icon"><Sparkles size={15} /></span>“I can help with that. What's your ZIP code?”</div>
                <div className="workflow-item"><CheckCircle2 size={18} /> Caller details captured</div>
                <div className="workflow-item"><CalendarDays size={18} /> Calendar availability checked</div>
                <div className="workflow-item"><BellRing size={18} /> Business owner notified</div>
              </div>
              <div className="call-panel-footer"><div className="mini-avatar">D</div><div><strong>Your front desk, always ready.</strong><small>Configured for your business</small></div><span className="waveform">▂▅▃▆▄▇▂▅</span></div>
            </div>
          </div>
        </section>

        <section className="trust-strip"><div className="site-container trust-inner"><span>DESIGNED FOR BUSY TEAMS</span><strong>HVAC</strong><strong>Plumbing</strong><strong>Electrical</strong><strong>Home services</strong></div></section>
        <section id="how" className="section site-container">
          <div className="section-heading"><div className="eyebrow">HOW DROXION WORKS</div><h2>More booked jobs. Less phone tag.</h2><p>We set up the call workflow with you, so your customers get the right answer and your team stays in control.</p></div>
          <div className="feature-grid">
            <article className="feature-card"><div className="feature-icon"><Headphones /></div><span className="step">01</span><h3>We answer your calls</h3><p>A natural-sounding AI receptionist answers with your business name and handles common questions.</p></article>
            <article className="feature-card"><div className="feature-icon"><CalendarDays /></div><span className="step">02</span><h3>Capture and schedule</h3><p>Collect caller details and book available slots through your connected calendar.</p></article>
            <article className="feature-card"><div className="feature-icon"><TrendingUp /></div><span className="step">03</span><h3>See what came in</h3><p>Review call summaries, appointment activity, and follow-up opportunities in one dashboard.</p></article>
          </div>
        </section>
        <section className="dark-section">
          <div className="site-container dark-layout">
            <div className="eyebrow eyebrow-green">MADE FOR REAL-WORLD CALLS</div><h2>Your business doesn't stop when the phone rings.</h2>
            <div className="dark-features">
              <p><Check size={18} /> After-hours and overflow call handling</p>
              <p><Check size={18} /> Missed-lead follow-up visibility</p>
              <p><Check size={18} /> Human transfer and escalation rules</p>
              <p><Check size={18} /> Service-area and business-hours FAQs</p>
            </div>
            <Link to="/demo" className="button button-light">Hear the demo <ArrowRight size={17} /></Link>
          </div>
        </section>
        <section id="pricing" className="section site-container pricing-section">
          <div className="section-heading"><div className="eyebrow">SIMPLE PRICING</div><h2>A front desk that fits your business.</h2><p>Managed setup, not a tool you're left to figure out alone.</p></div>
          <div className="pricing-card"><div><span className="price-label">MANAGED RECEPTIONIST</span><h3>Growth</h3><p>For service businesses ready to capture more calls.</p><div className="price"><strong>$499</strong><span>/ month</span></div><p className="setup-price">+ $500 one-time onboarding</p></div><div className="pricing-items"><p><Check size={17} /> AI phone receptionist</p><p><Check size={17} /> Up to 300 voice minutes per month</p><p><Check size={17} /> Call summaries and lead tracking</p><p><Check size={17} /> Calendar booking integration</p><p><Check size={17} /> Guided configuration and testing</p><p className="disclaimer">Extra usage and phone costs are disclosed and agreed before activation. Pricing is an introductory offer subject to confirmation.</p><Link to="/demo" className="button button-dark">Request a demo <ArrowRight size={17} /></Link></div></div>
        </section>
        <section className="section site-container faq"><div className="section-heading"><div className="eyebrow">QUESTIONS</div><h2>Good to know.</h2></div><div className="faq-list">{questions.map(([q, a], i) => <div className="faq-item" key={q}><button onClick={() => setFaq(faq === i ? -1 : i)} aria-expanded={faq === i}>{q}<span>{faq === i ? "−" : "+"}</span></button>{faq === i && <p>{a}</p>}</div>)}</div></section>
        <section className="bottom-cta"><div className="site-container"><h2>Stop letting good leads go to voicemail.</h2><p>Let us show you how Droxion would answer calls for your business.</p><Link to="/demo" className="button button-accent">Get a personalized demo <ArrowRight size={18} /></Link></div></section>
      </main>
      <footer className="footer"><div className="site-container footer-inner"><Link to="/" className="brand">Droxion<span className="brand-dot">.</span></Link><p>AI customer answering for service businesses.</p><a href={"mailto:" + CONTACT_EMAIL}>Contact</a><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><span>© {new Date().getFullYear()} Droxion</span></div></footer>
    </div>
  );
}

function Demo() {
  const [form, setForm] = useState({ contact_name: "", business_name: "", email: "", phone: "", city: "", website: "", call_volume: "10–30 per day", notes: "", website2: "", consent: false });
  const [state, setState] = useState({ sending: false, success: false, error: "" });
  async function submit(e) {
    e.preventDefault();
    if (!form.consent) { setState(s => ({ ...s, error: "Please agree to be contacted about this request." })); return; }
    setState({ sending: true, success: false, error: "" });
    try { await request("/api/demo", null, "POST", form); setState({ sending: false, success: true, error: "" }); }
    catch (err) { setState({ sending: false, success: false, error: err.message }); }
  }
  return <div className="public-page"><Header /><main className="form-section site-container"><div className="form-intro"><div className="eyebrow">GET A DEMO</div><h1>Let's see how many calls your team could save.</h1><p>Tell us about your business. We'll contact you to arrange a live demonstration and discuss whether Droxion fits your workflow.</p><ul><li><CheckCircle2 /> Real example calls</li><li><CheckCircle2 /> Booking and transfer walkthrough</li><li><CheckCircle2 /> No payment required to request a demo</li></ul></div><div className="form-card">{state.success ? <div className="success-panel"><CheckCircle2 size={42} /><h2>Request received.</h2><p>Thanks! We'll follow up using the contact information you provided.</p><Link className="button button-dark" to="/">Back to homepage</Link></div> : <form onSubmit={submit}><h2>Request your live demo</h2><p className="muted">Tell us where we can reach you.</p><div className="form-grid">{fields.map(f => <label key={f.key}>{f.label}<input required={f.required} type={f.type || "text"} maxLength={160} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} /></label>)}</div><label>Calls your business receives<select value={form.call_volume} onChange={e => setForm({ ...form, call_volume: e.target.value })}><option>Under 10 per day</option><option>10–30 per day</option><option>30–100 per day</option><option>Over 100 per day</option></select></label><label>Biggest phone problem (optional)<textarea rows={3} maxLength={1000} placeholder="Missed after-hours calls, booking appointments..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></label><label className="bot-field" aria-hidden="true">Leave this blank<input tabIndex="-1" autoComplete="off" value={form.website2} onChange={e => setForm({ ...form, website2: e.target.value })} /></label><label className="checkbox-label"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} /> I agree that Droxion may contact me about this demo request. No marketing texts without separate consent.</label>{state.error && <p className="form-error" role="alert">{state.error}</p>}<button className="button button-accent full-button" disabled={state.sending}>{state.sending ? "Sending..." : "Request my demo"} <ArrowRight size={18} /></button><p className="fine-print">Please don't send customer medical details or sensitive information.</p></form>}</div></main></div>;
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { if (supabase) supabase.auth.getSession().then(({ data }) => { if (data.session) navigate("/dashboard", { replace: true }); }); }, [navigate]);
  async function login(e) {
    e.preventDefault(); setWorking(true); setError(""); setMessage("");
    if (!supabase) { setError("Client login is not configured yet. Please contact support."); setWorking(false); return; }
    const { error: authError } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/dashboard", shouldCreateUser: true } });
    if (authError) setError(authError.message); else setMessage("Check your email for a secure sign-in link. It may take a minute.");
    setWorking(false);
  }
  return <div className="public-page"><Header /><main className="login-wrap"><div className="login-card"><div className="feature-icon"><ShieldCheck /></div><h1>Client sign in</h1><p>View real calls and appointments for your business. No passwords to remember.</p><form onSubmit={login}><label>Business email<input type="email" placeholder="you@business.com" required value={email} onChange={e => setEmail(e.target.value)} /></label>{error && <p role="alert" className="form-error">{error}</p>}{message && <p role="status" className="form-success">{message}</p>}<button className="button button-dark full-button" disabled={working}>{working ? "Sending..." : "Email me a sign-in link"} <ArrowRight size={17} /></button></form><p className="fine-print">New customer? <Link to="/demo">Request onboarding first.</Link> Accounts are linked to a business during setup.</p></div></main></div>;
}

function Pill({ children, variant = "" }) { return <span className={"pill " + variant}>{children}</span>; }
function fmtDate(s) { return s ? new Date(s).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—"; }
function fmtPhone(s) { return s || "Unknown caller"; }
function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null), [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(""), [busy, setBusy] = useState("");
  async function reload(token) { return await request("/api/portal", token); }
  useEffect(() => {
    let alive = true;
    if (!supabase) { setError("Authentication is not configured. Contact the site owner."); setLoading(false); return; }
    supabase.auth.getSession().then(async ({ data: { session: s }, error: authError }) => {
      if (!alive) return;
      if (authError || !s) { navigate("/login", { replace: true }); return; }
      setSession(s);
      try { const d = await reload(s.access_token); if (alive) setData(d); }
      catch (err) { if (alive) setError(err.message); }
      finally { if (alive) setLoading(false); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => { if (!s && alive) navigate("/login", { replace: true }); });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, [navigate]);
  async function signOut() { await supabase?.auth.signOut(); navigate("/"); }
  async function leadStatus(id, status) { setBusy(id); try { await request("/api/portal", session.access_token, "PATCH", { id, status }); setData(await reload(session.access_token)); } catch (err) { setError(err.message); } finally { setBusy(""); } }
  async function billing(action) { setBusy("billing"); try { const d = await request("/api/billing", session.access_token, "POST", { action }); if (d.url) window.location.assign(d.url); } catch (err) { setError(err.message); setBusy(""); } }
  if (loading) return <div className="portal-loading">Loading your workspace…</div>;
  const business = data?.business, calls = data?.calls || [], appointments = data?.appointments || [];
  const minutes = calls.reduce((n, c) => n + (Number(c.duration_seconds) || 0), 0) / 60;
  return <div className="portal-page"><aside className="portal-sidebar"><Link className="brand" to="/"><span className="brand-mark"><PhoneCall size={19} /></span>Droxion<span className="brand-dot">.</span></Link><p className="sidebar-heading">WORKSPACE</p><div className="side-link active"><TrendingUp size={18} /> Overview</div><a className="side-link" href="#recent-calls"><Phone size={18} /> Calls</a><a className="side-link" href="#bookings"><CalendarDays size={18} /> Appointments</a>{data?.admin && <a className="side-link" href="#prospects"><BellRing size={18} /> Sales leads</a>}<div className="sidebar-bottom"><a href={"mailto:" + CONTACT_EMAIL} className="side-link">Get support <ArrowRight size={16} /></a><button onClick={signOut} className="side-link"><LogOut size={18} /> Sign out</button></div></aside>
    <main className="portal-main"><div className="portal-topbar"><div><span className="portal-subtitle">BUSINESS OVERVIEW</span><h1>{business?.name || (data?.admin ? "Droxion sales workspace" : "Welcome to Droxion")}</h1><p>Your real customer activity, in one place.</p></div><div className="portal-actions"><Pill variant={business?.retell_agent_id ? "green" : "amber"}>{business?.retell_agent_id ? "Agent configured" : "Awaiting setup"}</Pill><button className="outline-button" onClick={signOut}><LogOut size={16} /> Sign out</button></div></div>
    {error && <div role="alert" className="portal-alert">{error}</div>}
    {!business && <div className="empty-banner"><PhoneMissed size={28} /><div><strong>No connected business yet.</strong><p>We link your account to your business during onboarding. {data?.admin ? "Use the sales leads section below to review inquiries." : "If you're already a customer, contact support."}</p><Link to="/demo" className="text-link">Request setup <ArrowRight size={16} /></Link></div></div>}
    {business && <><div className="metrics-grid"><div className="metric"><span>Recent calls</span><strong>{calls.length}</strong><small>Last {calls.length} recorded, up to 100</small><PhoneCall size={23} /></div><div className="metric"><span>Appointments</span><strong>{appointments.filter(a => a.status !== "cancelled").length}</strong><small>Recent confirmed bookings</small><CalendarDays size={23} /></div><div className="metric"><span>Call minutes</span><strong>{minutes.toFixed(1)}</strong><small>Displayed calls only</small><Clock3 size={23} /></div></div>
      <div className="workspace-grid"><section className="workspace-card"><div className="workspace-card-header"><div><h2>Your receptionist</h2><p>Connected phone and booking setup.</p></div><Pill variant={business.retell_agent_id ? "green" : "amber"}>{business.retell_agent_id ? "Configured" : "Pending"}</Pill></div><div className="receptionist-details"><div><span>Receptionist number</span><strong>{business.phone_number || "Not assigned yet"}</strong></div><div><span>Scheduling</span><strong>{business.cal_event_type_id ? "Calendar connected" : "Pending setup"}</strong></div><div><span>Subscription</span><strong>{business.subscription_status || "Not started"}</strong></div></div>{business.phone_number && <a className="button button-dark" href={"tel:" + business.phone_number}>Call your AI receptionist <Phone size={16} /></a>}<p className="fine-print">Phone routing and booking must pass test calls before accepting real customer traffic.</p></section>
      <section className="workspace-card"><div className="workspace-card-header"><div><h2>Billing</h2><p>Managed receptionist plan.</p></div></div><div className="billing-total"><strong>$499</strong><span>/ month</span></div><p>+ $500 one-time setup, with usage terms confirmed during onboarding.</p>{business.stripe_customer_id ? <button className="button button-dark" disabled={busy === "billing"} onClick={() => billing("portal")}>Manage billing <ArrowRight size={16} /></button> : <button className="button button-dark" disabled={busy === "billing"} onClick={() => billing("checkout")}>Start subscription <ArrowRight size={16} /></button>}</section></div>
      <section className="workspace-card table-card" id="recent-calls"><div className="workspace-card-header"><div><h2>Recent calls</h2><p>Summaries become available after Retell analyzes each call.</p></div></div>{calls.length ? <div className="table-scroll"><table><thead><tr><th>Caller</th><th>Time</th><th>Length</th><th>Summary</th></tr></thead><tbody>{calls.map(c => <tr key={c.id}><td>{fmtPhone(c.caller_number)}</td><td>{fmtDate(c.started_at || c.created_at)}</td><td>{Math.round((c.duration_seconds || 0) / 60 * 10) / 10} min</td><td>{c.summary || "Pending analysis"}</td></tr>)}</tbody></table></div> : <div className="empty-table">No calls yet. Verified call activity will appear here after your agent is connected.</div>}</section>
      <section className="workspace-card table-card" id="bookings"><div className="workspace-card-header"><div><h2>Appointments</h2><p>Synced from your connected Cal.com event.</p></div></div>{appointments.length ? <div className="table-scroll"><table><thead><tr><th>Customer</th><th>Scheduled</th><th>Status</th></tr></thead><tbody>{appointments.map(a => <tr key={a.id}><td>{a.customer_name || "Customer"}</td><td>{fmtDate(a.starts_at)}</td><td><Pill variant={a.status === "cancelled" ? "amber" : "green"}>{a.status}</Pill></td></tr>)}</tbody></table></div> : <div className="empty-table">No appointments recorded yet.</div>}</section></>}
    {data?.admin && <section className="workspace-card table-card" id="prospects"><div className="workspace-card-header"><div><h2>Sales inbox</h2><p>Real demo requests from potential customers.</p></div><Pill>{(data.inquiries || []).length} inquiries</Pill></div>{data.inquiries?.length ? <div className="table-scroll"><table><thead><tr><th>Business / contact</th><th>Phone</th><th>Location</th><th>Submitted</th><th>Pipeline</th></tr></thead><tbody>{data.inquiries.map(q => <tr key={q.id}><td><strong>{q.business_name}</strong><small>{q.contact_name} · <a href={"mailto:" + q.email}>{q.email}</a></small><small>{q.notes}</small></td><td><a href={"tel:" + q.phone}>{q.phone}</a><small>{q.call_volume}</small></td><td>{q.city}</td><td>{fmtDate(q.created_at)}</td><td><select aria-label={"Status for " + q.business_name} disabled={busy === q.id} value={q.status} onChange={e => leadStatus(q.id, e.target.value)}>{["new", "contacted", "demo_booked", "pilot", "closed_won", "closed_lost"].map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}</select></td></tr>)}</tbody></table></div> : <div className="empty-table">No inquiries have arrived yet. Share the demo page with prospects.</div>}</section>}
    </main>
  </div>;
}

function LegalPage({terms=false}){return <div className="public-page"><Header/><main className="section site-container" style={{maxWidth:850,lineHeight:1.8}}><div className="eyebrow">{terms?"SERVICE TERMS":"PRIVACY NOTICE"}</div><h1>{terms?"Service terms":"Privacy notice"}</h1><p>Updated October 6, 2026. Contact: <a href={"mailto:"+CONTACT_EMAIL}>{CONTACT_EMAIL}</a>.</p>{terms?<><h2>Service and billing</h2><p>Requesting a demonstration does not create a service contract. Plans, setup fees, voice-minute allowances, excess usage, cancellation, refunds, response times and service terms are confirmed in a separate written customer agreement before activation.</p><h2>Operational responsibility</h2><p>Each client must provide accurate business information, call notices and consent, escalation contacts, booking rules and emergency handling procedures. The AI receptionist does not replace emergency dispatch or professional advice.</p></>:<><h2>What we collect</h2><p>When requesting a demonstration, you provide your name, business, location, email, phone, call-volume estimate and optional details. We also process hashed IP data for abuse protection. For customers we may process telephone numbers, call times, booking details, short summaries and account information.</p><h2>Why we collect it</h2><p>We use this information to respond to inquiries, set up agreed services, track calls and bookings, process payments, maintain security and meet legal requirements.</p><h2>Providers</h2><p>We may use Supabase, Vercel, Retell AI, Cal.com and Stripe for data hosting, calls, scheduling and billing. Please don't enter medical details or sensitive information in the demo form. Caller notices, call-recording consent and retention limits must be confirmed before live use.</p><h2>Your choices</h2><p>For access, correction or deletion requests, contact us at the address above. Data is retained for service, security and applicable legal needs, subject to customer-specific retention agreements.</p></>}</main></div>}
export default function App() {
  useEffect(() => { document.title = "Droxion | AI Receptionist for Service Businesses"; }, []);
  return <BrowserRouter><Routes><Route path="/" element={<Home />} /><Route path="/demo" element={<Demo />} /><Route path="/privacy" element={<LegalPage />} /><Route path="/terms" element={<LegalPage terms />} /><Route path="/login" element={<Login />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="*" element={<Home />} /></Routes></BrowserRouter>;
}
