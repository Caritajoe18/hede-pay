import { useState } from "react";

const summaryCards = [
  {
    title: "Payroll Budget",
    value: "420,000 USDC",
    detail: "Available balance for current payroll cycle",
  },
  {
    title: "Policy Status",
    value: "Active",
    detail: "Whitelist and max spend rules are enforced",
  },
  {
    title: "Audit Trail",
    value: "23 events",
    detail: "Immutable HCS logs captured this month",
  },
  {
    title: "Agent Mode",
    value: "Autonomous",
    detail: "Agent is monitoring payroll operations",
  },
];

const payRuns = [
  {
    name: "Engineering Payroll",
    date: "Jun 18, 2026",
    status: "Settled",
    amount: "141,200 USDC",
  },
  {
    name: "Operations Payroll",
    date: "Jun 17, 2026",
    status: "Review Required",
    amount: "92,400 USDC",
  },
  {
    name: "Contractor Disbursements",
    date: "Jun 15, 2026",
    status: "Approved",
    amount: "31,800 USDC",
  },
];

const policies = [
  {
    label: "Max Spend Policy",
    value: "30,000 USDC per transfer",
    status: "Compliant",
  },
  {
    label: "Whitelist Policy",
    value: "42 approved accounts",
    status: "Enabled",
  },
  {
    label: "HCS Audit Hook",
    value: "Live",
    status: "Streaming",
  },
];

function App() {
  const [view, setView] = useState<"landing" | "login" | "signup" | "dashboard">("landing");

  const renderLanding = () => (
    <div className="app-shell landing-shell">
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="eyebrow">HedePay</span>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <button type="button" className="button-alt" onClick={() => setView("login")}>Login</button>
          <button type="button" onClick={() => setView("signup")}>Sign Up</button>
        </div>
      </nav>

      <header className="hero-panel landing-hero" id="home">
        <div>
          <span className="eyebrow">HedePay</span>
          <h1>Autonomous payroll for Hedera-native enterprises</h1>
          <p>
            HedePay automates payroll disbursements using Hedera policies and immutable HCS audit trails. The result is secure salary payment, compliance enforcement, and transparent reporting in a single enterprise dashboard.
          </p>
          <div className="hero-actions landing-actions">
            <button type="button" onClick={() => setView("signup")}>Get started</button>
            <button type="button" className="button-alt" onClick={() => setView("login")}>Login</button>
          </div>
        </div>
        <div className="hero-panel-visual">
          <div className="hero-stat">
            <span>Autonomous</span>
            <strong>Policy-driven payroll</strong>
          </div>
          <div className="hero-stat">
            <span>HCS Audit</span>
            <strong>Immutable transaction log</strong>
          </div>
          <div className="hero-stat">
            <span>HBAR + USDC</span>
            <strong>Compliance-ready payouts</strong>
          </div>
        </div>
      </header>

      <section className="landing-overview" id="about">
        <div className="overview-card">
          <h2>What is HedePay?</h2>
          <p>
            HedePay is a governed payroll agent built on the Hedera Agent Kit. It automates enterprise salary disbursements while enforcing max-spend and whitelist policies, and records every action on the Hedera Consensus Service for auditability.
          </p>
        </div>
        <div className="overview-card">
          <h2>Why choose HedePay?</h2>
          <p>
            Use HedePay to reduce manual payroll risk, enforce compliance across HBAR and USDC flows, and keep a permanent, tamper-resistant log of all disbursements and policy decisions.
          </p>
        </div>
      </section>

      <section className="landing-grid" id="features">
        <article className="landing-card">
          <h3>Governed Disbursements</h3>
          <p>Only authorized accounts receive payments, and every transfer is checked against active spend policy rules.</p>
        </article>
        <article className="landing-card">
          <h3>Immutable Audits</h3>
          <p>All payroll runs and policy denials are logged to HCS, so every financial event is traceable and verifiable.</p>
        </article>
        <article className="landing-card">
          <h3>Smart Compliance</h3>
          <p>Integrates with third-party tax and compliance APIs before payments execute, keeping payroll aligned with corporate policy.</p>
        </article>
      </section>

      <section className="landing-detail" id="contact">
        <div>
          <h2>Start with confidence</h2>
          <p>
            Whether you are launching a new Hedera payroll flow or upgrading existing payroll controls, HedePay gives teams an easy onboarding path with enterprise-level policy governance and audit visibility.
          </p>
          <button type="button" onClick={() => setView("signup")}>Create account</button>
        </div>
      </section>
    </div>
  );

  const renderAuthForm = (mode: "login" | "signup") => (
    <div className="app-shell landing-shell">
      <header className="hero-panel auth-hero">
        <div>
          <span className="eyebrow">HedePay</span>
          <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p>
            {mode === "login"
              ? "Sign in to your HedePay dashboard and continue managing payroll with Hedera governance."
              : "Start a new HedePay workspace to automate compliant salary disbursements and audit every payout."}
          </p>
        </div>
      </header>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
            <button type="button" className="button-alt small" onClick={() => setView("landing")}>Back</button>
          </div>
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setView("dashboard"); }}>
            <label>
              Email
              <input type="email" placeholder="name@company.com" required />
            </label>
            <label>
              Password
              <input type="password" placeholder="••••••••" required />
            </label>
            {mode === "signup" && (
              <label>
                Company name
                <input type="text" placeholder="Example Corp" required />
              </label>
            )}
            <button type="submit" className="primary-button">
              {mode === "login" ? "Continue" : "Create account"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );

  const renderDashboard = () => (
    <div className="app-shell">
      <header className="hero-panel">
        <div>
          <span className="eyebrow">HedePay</span>
          <h1>Autonomous Hedera Payroll Dashboard</h1>
          <p>
            Monitor payroll disbursements, policy compliance, and HCS audit trails from a single agent dashboard.
          </p>
        </div>
        <div className="hero-actions">
          <button type="button">Review policies</button>
          <button type="button" className="button-alt">
            Inspect audit logs
          </button>
        </div>
      </header>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <article key={card.title} className="summary-card">
            <h2>{card.title}</h2>
            <p className="value">{card.value}</p>
            <p className="detail">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Latest payroll executions</p>
              <h2>Recent runs</h2>
            </div>
            <button type="button" className="panel-button">
              Refresh data
            </button>
          </div>

          <div className="table-list">
            <div className="table-row header-row">
              <span>Run</span>
              <span>Date</span>
              <span>Status</span>
              <span>Amount</span>
            </div>
            {payRuns.map((run) => (
              <div key={run.name} className="table-row">
                <span>{run.name}</span>
                <span>{run.date}</span>
                <span>{run.status}</span>
                <span>{run.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel panel-secondary">
          <div className="panel-header">
            <div>
              <p className="panel-label">Compliance snapshot</p>
              <h2>Policy health</h2>
            </div>
            <button type="button" className="panel-button button-alt">
              View rules
            </button>
          </div>

          <div className="policy-list">
            {policies.map((policy) => (
              <article key={policy.label} className="policy-card">
                <div>
                  <p>{policy.label}</p>
                  <strong>{policy.value}</strong>
                </div>
                <span>{policy.status}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  if (view === "landing") return renderLanding();
  if (view === "login") return renderAuthForm("login");
  if (view === "signup") return renderAuthForm("signup");
  return renderDashboard();
}

export default App;
