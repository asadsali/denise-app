import React, { useState, useMemo } from "react";

// ============================================================================
// The Money Store — Denise Krohn | Investor Assessment Lead-Gen App
// Brand: soft green + warm white, clean typography.
// Verified facts sourced from themoneystore.com/lo/denise-krohn:
//   NMLS ID #318876 · headshot URL · English-only materials ·
//   serves Chicagoland, Wisconsin, Indiana, Florida · booking link.
// ============================================================================

const BRAND = {
  green: "#3F6B53",
  greenDeep: "#2E5340",
  greenSoft: "#6E9A82",
  mint: "#E8F1EA",
  mintDeep: "#D7E7DC",
  warm: "#FFFDF8",
  ink: "#243029",
  muted: "#6B7C72",
  line: "#DCE7DF",
};

const HEADSHOT =
  "https://www.themoneystore.com/wp-content/uploads/Denise-Krohn-1x1-1.png";
const LOGO = "https://www.themoneystore.com/wp-content/uploads/TMS-Primary-Green.svg";
const BOOKING = "https://mymortgage.themoneystore.com/dr/c/hndhl";

const fontStack =
  '"Poppins", "Century Gothic", "Questrial", system-ui, sans-serif';
const bodyStack = '"Mulish", "Helvetica Neue", system-ui, sans-serif';

// ---------------------------------------------------------------------------
// Assessment questions
// ---------------------------------------------------------------------------
const QUESTIONS = [
  {
    id: "age",
    label: "What's your age range?",
    options: ["Under 30", "30–44", "45–59", "60+"],
  },
  {
    id: "occupation",
    label: "Which best describes your occupation?",
    options: ["W-2 employee", "Self-employed / business owner", "Retired", "Other"],
  },
  {
    id: "income",
    label: "Approximate annual household income?",
    options: ["Under $75k", "$75k–$150k", "$150k–$300k", "$300k+"],
  },
  {
    id: "funds",
    label: "Funds available to invest right now?",
    options: ["Under $25k", "$25k–$75k", "$75k–$200k", "$200k+"],
  },
  {
    id: "credit",
    label: "Estimated credit score?",
    options: ["Below 620", "620–679", "680–739", "740+"],
  },
  {
    id: "time",
    label: "Time you can commit each week?",
    options: ["A few hours", "5–10 hours", "10+ hours", "I want it fully passive"],
  },
  {
    id: "goal",
    label: "Your primary goal?",
    options: ["Monthly cash flow", "Long-term appreciation", "Retirement income", "Build a portfolio fast"],
  },
  {
    id: "risk",
    label: "Your risk tolerance?",
    options: ["Conservative", "Moderate", "Growth-oriented", "Aggressive"],
  },
  {
    id: "involvement",
    label: "Preferred level of involvement?",
    options: ["Hands-off", "Light oversight", "Hands-on manager", "Full-time investor"],
  },
  {
    id: "geo",
    label: "Where are you looking to invest?",
    options: ["Chicagoland", "Wisconsin", "Indiana", "Florida"],
  },
];

// ---------------------------------------------------------------------------
// Segmentation logic
// ---------------------------------------------------------------------------
function classify(a) {
  const passive = a.time === "I want it fully passive" || a.involvement === "Hands-off";
  const aggressive = a.risk === "Aggressive" || a.goal === "Build a portfolio fast";
  const handsOn = a.involvement === "Hands-on manager" || a.involvement === "Full-time investor";
  const retirement = a.goal === "Retirement income" || a.age === "60+";
  const selfEmployed = a.occupation === "Self-employed / business owner";

  if (passive && !handsOn) {
    return {
      segment: "Passive Wealth Builder",
      blurb:
        "You want your money working without the day-to-day landlord grind. Denise can structure financing that lets you scale quietly in the background.",
      products: [
        { name: "DSCR Loan", why: "Qualifies on the property's rental income, not your personal DTI — ideal for hands-off scaling." },
        { name: "Small Multifamily (5–10 unit)", why: "Stable, professionally managed cash flow with one financing package." },
      ],
    };
  }
  if (aggressive && handsOn) {
    return {
      segment: "BRRRR Investor",
      blurb:
        "Buy, Rehab, Rent, Refinance, Repeat. You're growth-oriented and willing to roll up your sleeves. Denise can line up the refinance leg so you recycle capital quickly.",
      products: [
        { name: "DSCR Cash-Out Refinance", why: "Pull capital back out after the rehab to fund your next deal." },
        { name: "Renovation Financing", why: "Bundle purchase and rehab into a single loan to move fast." },
      ],
    };
  }
  if (retirement) {
    return {
      segment: "Retirement Income Investor",
      blurb:
        "You're focused on durable, predictable income. Denise can help you build a portfolio designed to pay you steadily for years.",
      products: [
        { name: "DSCR Loan", why: "Income-based qualification works well in or near retirement." },
        { name: "Small Multifamily Loan", why: "Diversified rent rolls smooth out monthly income." },
      ],
    };
  }
  if (selfEmployed) {
    return {
      segment: "Entrepreneur Investor",
      blurb:
        "As a business owner, your tax returns rarely tell the whole story. Denise specializes in financing that looks past W-2 paperwork.",
      products: [
        { name: "DSCR Loan", why: "No tax returns or income docs — qualifies on the property itself." },
        { name: "SBA Loan", why: "If you're combining real estate with an operating business, SBA financing can fit." },
      ],
    };
  }
  return {
    segment: "Rental Property Investor",
    blurb:
      "You're building wealth through buy-and-hold rentals. Denise can match you with financing that balances cash flow and long-term equity.",
    products: [
      { name: "DSCR Loan", why: "Streamlined qualification based on rental income." },
      { name: "Conventional Investment Loan", why: "Competitive rates when your personal income supports it." },
      { name: "Small Multifamily Loan", why: "Step up to 2–4 or 5–10 units as you grow." },
    ],
  };
}

// ---------------------------------------------------------------------------
// Demo data for admin dashboard
// ---------------------------------------------------------------------------
const DEMO_LEADS = [
  { name: "Marcus Reilly", seg: "BRRRR Investor", src: "Referral — Realtor", geo: "Chicagoland", date: "Jun 02" },
  { name: "Priya Anand", seg: "Passive Wealth Builder", src: "Instagram", geo: "Florida", date: "Jun 01" },
  { name: "Tom & Lisa Beck", seg: "Retirement Income Investor", src: "Referral — CPA", geo: "Wisconsin", date: "May 30" },
  { name: "Jordan Wells", seg: "Rental Property Investor", src: "LinkedIn", geo: "Indiana", date: "May 29" },
  { name: "Sofia Marin", seg: "Entrepreneur Investor", src: "Website", geo: "Chicagoland", date: "May 28" },
  { name: "Derek Olsen", seg: "Rental Property Investor", src: "Referral — Realtor", geo: "Wisconsin", date: "May 27" },
];
const SEG_COUNTS = [
  { label: "Rental Property", n: 14 },
  { label: "Passive Wealth", n: 9 },
  { label: "BRRRR", n: 7 },
  { label: "Retirement Income", n: 5 },
  { label: "Entrepreneur", n: 3 },
];
const SRC_COUNTS = [
  { label: "Realtor Referral", n: 16 },
  { label: "CPA Referral", n: 8 },
  { label: "Instagram", n: 6 },
  { label: "LinkedIn", n: 5 },
  { label: "Website", n: 3 },
];

// ---------------------------------------------------------------------------
// Small UI atoms
// ---------------------------------------------------------------------------
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <img src={LOGO} alt="The Money Store" style={{ height: 28 }} />
  </div>
);

function Btn({ children, onClick, kind = "solid", disabled, full }) {
  const base = {
    fontFamily: fontStack,
    fontWeight: 600,
    fontSize: 16,
    padding: "15px 28px",
    borderRadius: 999,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    width: full ? "100%" : "auto",
    transition: "transform .15s ease, box-shadow .15s ease, opacity .15s",
    opacity: disabled ? 0.45 : 1,
  };
  const styles =
    kind === "solid"
      ? { ...base, background: BRAND.green, color: "#fff", boxShadow: "0 8px 20px rgba(63,107,83,.28)" }
      : { ...base, background: "transparent", color: BRAND.green, border: `1.5px solid ${BRAND.line}` };
  return (
    <button
      style={styles}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome|assess|results|capture|done|admin
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });

  const result = useMemo(() => classify(answers), [answers]);
  const progress = Math.round((step / QUESTIONS.length) * 100);

  const pick = (id, opt) => {
    const next = { ...answers, [id]: opt };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) setStep(step + 1);
    else setScreen("results");
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setLead({ name: "", email: "", phone: "" });
    setScreen("welcome");
  };

  const leadValid =
    lead.name.trim() && /\S+@\S+\.\S+/.test(lead.email) && lead.phone.trim().length >= 7;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(120% 80% at 50% -10%, ${BRAND.mint} 0%, ${BRAND.warm} 55%)`,
        fontFamily: bodyStack,
        color: BRAND.ink,
        padding: "0 0 60px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Mulish:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color:${BRAND.muted}; }
        @keyframes rise { from { opacity:0; transform: translateY(14px);} to {opacity:1; transform:none;} }
        .rise { animation: rise .5s cubic-bezier(.2,.7,.3,1) both; }
      `}</style>

      {/* Top bar */}
      <header
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo />
        <button
          onClick={() => setScreen(screen === "admin" ? "welcome" : "admin")}
          style={{
            fontFamily: fontStack,
            fontSize: 13,
            fontWeight: 600,
            color: BRAND.muted,
            background: "#fff",
            border: `1px solid ${BRAND.line}`,
            borderRadius: 999,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          {screen === "admin" ? "← Back to app" : "Admin Dashboard"}
        </button>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "10px 22px" }}>
        {screen === "welcome" && <Welcome onStart={() => setScreen("assess")} />}
        {screen === "assess" && (
          <Assess
            q={QUESTIONS[step]}
            step={step}
            total={QUESTIONS.length}
            progress={progress}
            current={answers[QUESTIONS[step].id]}
            onPick={pick}
            onBack={() => (step === 0 ? setScreen("welcome") : setStep(step - 1))}
          />
        )}
        {screen === "results" && (
          <Results result={result} geo={answers.geo} onNext={() => setScreen("capture")} />
        )}
        {screen === "capture" && (
          <Capture
            lead={lead}
            setLead={setLead}
            valid={leadValid}
            segment={result.segment}
            onSubmit={() => setScreen("done")}
          />
        )}
        {screen === "done" && <Done lead={lead} onReset={reset} />}
        {screen === "admin" && <Admin />}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------
function Card({ children, style }) {
  return (
    <div
      className="rise"
      style={{
        background: "#fff",
        borderRadius: 24,
        border: `1px solid ${BRAND.line}`,
        boxShadow: "0 20px 50px rgba(46,83,64,.08)",
        padding: 30,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Welcome({ onStart }) {
  return (
    <Card style={{ textAlign: "center", paddingTop: 38 }}>
      <div
        style={{
          width: 132,
          height: 132,
          margin: "0 auto 18px",
          borderRadius: "50%",
          padding: 5,
          background: `linear-gradient(135deg, ${BRAND.greenSoft}, ${BRAND.green})`,
          boxShadow: "0 14px 30px rgba(63,107,83,.3)",
        }}
      >
        <img
          src={HEADSHOT}
          alt="Denise Krohn"
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block", background: "#fff" }}
        />
      </div>
      <div style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 18, color: BRAND.greenDeep }}>
        Denise Krohn
      </div>
      <div style={{ color: BRAND.muted, fontSize: 14, marginTop: 2 }}>
        Mortgage Loan Originator · NMLS&nbsp;ID&nbsp;#318876
      </div>

      <h1
        style={{
          fontFamily: fontStack,
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 1.15,
          margin: "26px auto 14px",
          maxWidth: 460,
          color: BRAND.ink,
        }}
      >
        Your investment journey starts here.
      </h1>
      <p style={{ fontSize: 16.5, lineHeight: 1.6, color: BRAND.muted, maxWidth: 500, margin: "0 auto 28px" }}>
        Denise takes a hands-on, customer-centric approach and collaborates closely with referral
        partners to bolster their businesses. Take a 2-minute assessment and she'll match you with the
        right financing strategy.
      </p>
      <Btn onClick={onStart}>Start Your Investor Assessment →</Btn>
      <div style={{ marginTop: 22, fontSize: 12.5, color: BRAND.muted }}>
        Guiding investors across Chicagoland · Wisconsin · Indiana · Florida
      </div>
    </Card>
  );
}

function Assess({ q, step, total, progress, current, onPick, onBack }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: BRAND.muted, cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 }}>
          ← Back
        </button>
        <span style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: BRAND.greenSoft }}>
          Question {step + 1} of {total}
        </span>
      </div>
      <div style={{ height: 7, background: BRAND.mintDeep, borderRadius: 99, overflow: "hidden", marginBottom: 26 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: BRAND.green, borderRadius: 99, transition: "width .4s ease" }} />
      </div>

      <h2 style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 24, lineHeight: 1.25, marginBottom: 22 }}>
        {q.label}
      </h2>

      <div style={{ display: "grid", gap: 12 }}>
        {q.options.map((opt) => {
          const active = current === opt;
          return (
            <button
              key={opt}
              onClick={() => onPick(q.id, opt)}
              style={{
                textAlign: "left",
                fontFamily: bodyStack,
                fontSize: 16,
                fontWeight: 500,
                padding: "16px 20px",
                borderRadius: 14,
                cursor: "pointer",
                background: active ? BRAND.mint : "#fff",
                color: active ? BRAND.greenDeep : BRAND.ink,
                border: `1.5px solid ${active ? BRAND.green : BRAND.line}`,
                transition: "all .15s ease",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = BRAND.greenSoft; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = BRAND.line; }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function Results({ result, geo, onNext }) {
  return (
    <Card>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: BRAND.greenSoft, textTransform: "uppercase", letterSpacing: 1 }}>
          Your Investor Profile
        </span>
      </div>
      <h2 style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 30, textAlign: "center", color: BRAND.greenDeep, margin: "4px 0 16px" }}>
        {result.segment}
      </h2>
      <p style={{ fontSize: 16.5, lineHeight: 1.6, color: BRAND.muted, textAlign: "center", maxWidth: 520, margin: "0 auto 26px" }}>
        {result.blurb}
      </p>

      <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 14, color: BRAND.ink, marginBottom: 12 }}>
        Recommended financing options
      </div>
      <div style={{ display: "grid", gap: 12, marginBottom: 26 }}>
        {result.products.map((p) => (
          <div key={p.name} style={{ background: BRAND.mint, border: `1px solid ${BRAND.mintDeep}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 16, color: BRAND.greenDeep }}>{p.name}</div>
            <div style={{ fontSize: 14.5, color: BRAND.muted, marginTop: 4, lineHeight: 1.5 }}>{p.why}</div>
          </div>
        ))}
      </div>

      <div style={{ background: BRAND.greenDeep, borderRadius: 16, padding: "18px 20px", color: "#fff", marginBottom: 24 }}>
        <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 15 }}>
          Denise guides investors across Chicagoland, Wisconsin, Indiana, and Florida.
        </div>
        {geo && (
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
            You selected <strong>{geo}</strong> — a market she actively serves.
          </div>
        )}
      </div>

      <Btn full onClick={onNext}>See My Strategy &amp; Connect →</Btn>
    </Card>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontFamily: fontStack, fontWeight: 600, fontSize: 13.5, marginBottom: 6, color: BRAND.ink }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          fontFamily: bodyStack,
          fontSize: 16,
          padding: "14px 16px",
          borderRadius: 12,
          border: `1.5px solid ${BRAND.line}`,
          outline: "none",
          background: BRAND.warm,
          color: BRAND.ink,
        }}
        onFocus={(e) => (e.target.style.borderColor = BRAND.green)}
        onBlur={(e) => (e.target.style.borderColor = BRAND.line)}
      />
    </label>
  );
}

function Capture({ lead, setLead, valid, segment, onSubmit }) {
  return (
    <Card>
      <h2 style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 27, marginBottom: 8, color: BRAND.ink }}>
        Schedule a Strategy Session with Denise
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.55, color: BRAND.muted, marginBottom: 24 }}>
        Share your details and Denise will personally walk you through your{" "}
        <strong style={{ color: BRAND.greenDeep }}>{segment}</strong> plan and next steps.
      </p>

      <Field label="Full name" value={lead.name} placeholder="Jane Investor" onChange={(v) => setLead({ ...lead, name: v })} />
      <Field label="Email address" type="email" value={lead.email} placeholder="jane@email.com" onChange={(v) => setLead({ ...lead, email: v })} />
      <Field label="Phone number" type="tel" value={lead.phone} placeholder="(312) 555-0142" onChange={(v) => setLead({ ...lead, phone: v })} />

      <Btn full disabled={!valid} onClick={onSubmit}>
        Book My Strategy Session
      </Btn>
      <p style={{ fontSize: 12, color: BRAND.muted, marginTop: 16, lineHeight: 1.5, textAlign: "center" }}>
        All loan materials will be provided in English. By submitting, you agree to be contacted by
        Denise Krohn regarding your inquiry.
      </p>
    </Card>
  );
}

function Done({ lead, onReset }) {
  return (
    <Card style={{ textAlign: "center", paddingTop: 40 }}>
      <div
        style={{
          width: 70, height: 70, borderRadius: "50%", margin: "0 auto 20px",
          background: BRAND.mint, display: "grid", placeItems: "center",
          border: `2px solid ${BRAND.green}`,
        }}
      >
        <span style={{ fontSize: 34, color: BRAND.green }}>✓</span>
      </div>
      <h2 style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 27, marginBottom: 10 }}>
        You're all set{lead.name ? `, ${lead.name.split(" ")[0]}` : ""}!
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: BRAND.muted, maxWidth: 440, margin: "0 auto 26px" }}>
        Your assessment is in Denise's hands. Pick a time that works for you and she'll come prepared
        with a financing strategy tailored to your profile.
      </p>
      <a href={BOOKING} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
        <Btn>Open Denise's Booking Calendar →</Btn>
      </a>
      <div style={{ marginTop: 18 }}>
        <button onClick={onReset} style={{ background: "none", border: "none", color: BRAND.muted, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Start a new assessment
        </button>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Admin dashboard
// ---------------------------------------------------------------------------
function Stat({ label, value, sub }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BRAND.line}`, borderRadius: 18, padding: "20px 22px", flex: 1, minWidth: 140 }}>
      <div style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 30, color: BRAND.greenDeep }}>{value}</div>
      <div style={{ fontSize: 13, color: BRAND.ink, fontWeight: 600, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function BarRow({ label, n, max }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 5 }}>
        <span style={{ fontWeight: 600, color: BRAND.ink }}>{label}</span>
        <span style={{ color: BRAND.muted }}>{n}</span>
      </div>
      <div style={{ height: 9, background: BRAND.mint, borderRadius: 99 }}>
        <div style={{ width: `${(n / max) * 100}%`, height: "100%", background: BRAND.green, borderRadius: 99 }} />
      </div>
    </div>
  );
}

function Admin() {
  const segMax = Math.max(...SEG_COUNTS.map((s) => s.n));
  const srcMax = Math.max(...SRC_COUNTS.map((s) => s.n));
  return (
    <div className="rise">
      <h2 style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 26, marginBottom: 4 }}>
        Lead Dashboard
      </h2>
      <p style={{ color: BRAND.muted, fontSize: 14, marginBottom: 20 }}>
        Demo data · Denise Krohn, The Money Store
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <Stat label="Leads generated" value="38" sub="last 30 days" />
        <Stat label="Strategy sessions" value="21" sub="55% conversion" />
        <Stat label="Avg. funds available" value="$96k" sub="self-reported" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <Card style={{ padding: 22 }}>
          <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
            Investment profiles selected
          </div>
          {SEG_COUNTS.map((s) => <BarRow key={s.label} {...s} max={segMax} />)}
        </Card>
        <Card style={{ padding: 22 }}>
          <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
            Referral sources
          </div>
          {SRC_COUNTS.map((s) => <BarRow key={s.label} {...s} max={srcMax} />)}
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 15, padding: "18px 22px 12px" }}>
          Recent leads
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: BRAND.mint, color: BRAND.greenDeep, textAlign: "left" }}>
                {["Name", "Profile", "Source", "Market", "Date"].map((h) => (
                  <th key={h} style={{ padding: "11px 22px", fontFamily: fontStack, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_LEADS.map((l, i) => (
                <tr key={l.name} style={{ borderTop: `1px solid ${BRAND.line}`, background: i % 2 ? BRAND.warm : "#fff" }}>
                  <td style={{ padding: "12px 22px", fontWeight: 600, color: BRAND.ink }}>{l.name}</td>
                  <td style={{ padding: "12px 22px", color: BRAND.muted }}>{l.seg}</td>
                  <td style={{ padding: "12px 22px", color: BRAND.muted }}>{l.src}</td>
                  <td style={{ padding: "12px 22px", color: BRAND.muted }}>{l.geo}</td>
                  <td style={{ padding: "12px 22px", color: BRAND.muted }}>{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
