import { useState, useRef, useEffect } from "react";

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

const guardrails = [
  { label: "Max Spend Limit", value: "30,000 USDC per transfer" },
  { label: "Employee Whitelist", value: "42 approved accounts" },
  { label: "Department Scope", value: "Engineering, Operations, Contractors" },
];

const employees = [
  { id: "0.0.9821", name: "Alice Chen", dept: "Engineering", salary: "12,500 USDC" },
  { id: "0.0.9822", name: "Bob Martinez", dept: "Engineering", salary: "11,800 USDC" },
  { id: "0.0.9823", name: "Carol Singh", dept: "Engineering", salary: "13,200 USDC" },
  { id: "0.0.9824", name: "David Kim", dept: "Engineering", salary: "10,900 USDC" },
  { id: "0.0.9825", name: "Eve Johnson", dept: "Engineering", salary: "14,100 USDC" },
];

type ActivityEvent = {
  id: number;
  type: "compliance" | "mpp" | "hcs" | "policy" | "approval";
  message: string;
  timestamp: string;
};

type Message = {
  role: "user" | "agent";
  text: string;
};

function App() {
  const [view, setView] = useState<"landing" | "login" | "signup" | "dashboard">("dashboard");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "Welcome to HedePay. I'm your payroll agent. Active guardrails: max 30,000 USDC per transfer, 42 whitelisted employees. How would you like to proceed?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
    { id: 1, type: "policy", message: "Agent initialized with whitelist and max spend policies", timestamp: "09:32:15" },
  ]);
  const [nextActivityId, setNextActivityId] = useState(2);
  const [showHITL, setShowHITL] = useState(false);
  const [hitlDetails, setHitlDetails] = useState({ amount: "", reason: "" });
  const [showAuditConfirm, setShowAuditConfirm] = useState(false);
  const [hcsTopic, setHcsTopic] = useState("0.0.0.0");
  const [payrollCycleId, setPayrollCycleId] = useState(0);
  const [payrollRunActive, setPayrollRunActive] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addActivity = (type: ActivityEvent["type"], message: string) => {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setActivityFeed((prev) => [{ id: nextActivityId, type, message, timestamp }, ...prev]);
    setNextActivityId((id) => id + 1);
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const simulatePayrollRun = async (department: string, currency: string) => {
    setIsProcessing(true);
    setPayrollRunActive(true);

    addActivity("policy", `Checking whitelist for ${department} department employees...`);
    await sleep(800);

    const deptEmployees = employees.filter((e) => e.dept.toLowerCase() === department.toLowerCase());
    if (deptEmployees.length === 0) {
      setMessages((prev) => [...prev, { role: "agent", text: `No employees found in the ${department} department whitelist.` }]);
      setIsProcessing(false);
      setPayrollRunActive(false);
      return;
    }

    const employeeList = deptEmployees.map((e) => `${e.name} (${e.id})`).join(", ");
    setMessages((prev) => [
      ...prev,
      { role: "agent", text: `Found ${deptEmployees.length} whitelisted employees in ${department}: ${employeeList}. Preparing transfers in ${currency}.` },
    ]);
    addActivity("policy", `${deptEmployees.length} whitelisted employees identified in ${department}`);
    await sleep(1000);

    addActivity("mpp", "Initiating MPP compliance payment: $0.01 USDC to verify tax withholding for this cycle");
    setMessages((prev) => [
      ...prev,
      { role: "agent", text: `Paying $0.01 ${currency} via MPP to verify tax withholding for this cycle.` },
    ]);
    await sleep(1200);
    addActivity("mpp", "MPP compliance check completed — tax withholding verified");

    const totalAmount = deptEmployees.reduce((sum, e) => {
      const num = parseInt(e.salary.replace(/[^0-9]/g, ""));
      return sum + num;
    }, 0);

    setMessages((prev) => [
      ...prev,
      { role: "agent", text: `Compliance check passed. Total disbursement: ${totalAmount.toLocaleString()} ${currency}. Checking against max spend policy...` },
    ]);
    addActivity("compliance", `Total ${totalAmount.toLocaleString()} ${currency} — checking against 30,000 USDC max spend limit`);
    await sleep(800);

    if (totalAmount > 30000) {
      setHitlDetails({ amount: `${totalAmount.toLocaleString()} ${currency}`, reason: "Exceeds daily max spend limit of 30,000 USDC" });
      setShowHITL(true);
      addActivity("policy", `HITL triggered: ${totalAmount.toLocaleString()} ${currency} exceeds 30,000 USDC limit`);
      setIsProcessing(false);
      return;
    }

    await completePayroll(totalAmount, currency, deptEmployees);
  };

  const completePayroll = async (totalAmount: number, currency: string, deptEmployees: typeof employees) => {
    for (const emp of deptEmployees) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: `Disbursing ${emp.salary} to ${emp.name} (${emp.id})...` },
      ]);
      addActivity("compliance", `Transferring ${emp.salary} to ${emp.name} — policy check passed`);
      await sleep(600);
    }

    const cycleId = Math.floor(Math.random() * 900) + 100;
    const topic = `0.0.${Math.floor(Math.random() * 900000) + 100000}`;
    setPayrollCycleId(cycleId);
    setHcsTopic(topic);

    addActivity("hcs", `Payroll Cycle #${cycleId} logged to HCS Topic ${topic}`);
    setShowAuditConfirm(true);
    setPayrollRunActive(false);
  };

  const handleHITLApprove = async () => {
    setShowHITL(false);
    setMessages((prev) => [...prev, { role: "agent", text: "Override approved. Proceeding with disbursement." }]);
    addActivity("approval", "Human-in-the-loop override approved — proceeding with disbursement");

    const matches = hitlDetails.amount.match(/[\d,]+/);
    const totalAmount = matches ? parseInt(matches[0].replace(/,/g, "")) : 0;
    await completePayroll(totalAmount, "USDC", employees.filter((e) => e.dept === "Engineering"));
  };

  const handleHITLDeny = () => {
    setShowHITL(false);
    setMessages((prev) => [...prev, { role: "agent", text: "Transaction denied. Payroll run cancelled. Adjust policy limits or reduce transfer amounts and try again." }]);
    addActivity("approval", "Human-in-the-loop override denied — payroll run cancelled");
    setIsProcessing(false);
    setPayrollRunActive(false);
  };

  const handleSend = async () => {
    const cmd = input.trim();
    if (!cmd || isProcessing) return;

    setMessages((prev) => [...prev, { role: "user", text: cmd }]);
    setInput("");
    addActivity("compliance", `Processing command: "${cmd}"`);

    const cmdLower = cmd.toLowerCase();
    const deptMatch = cmdLower.match(/(engineering|operations|contractors?)\s*(department)?/);
    const currency = cmdLower.includes("hbar") ? "HBAR" : "USDC";
    const department = deptMatch ? deptMatch[1] : "Engineering";

    if (cmdLower.includes("disburse") || cmdLower.includes("pay") || cmdLower.includes("send salary") || cmdLower.includes("payroll")) {
      const deptDisplay = department.charAt(0).toUpperCase() + department.slice(1).replace(/s$/, "");
      await sleep(500);
      setMessages((prev) => [...prev, { role: "agent", text: `Initiating payroll run for ${deptDisplay} department in ${currency}. Identifying employees from the whitelist...` }]);
      addActivity("policy", `Payroll initiation: ${deptDisplay} department, ${currency}`);
      await simulatePayrollRun(deptDisplay, currency);
    } else if (cmdLower.includes("hello") || cmdLower.includes("hi") || cmdLower.includes("hey")) {
      await sleep(400);
      setMessages((prev) => [...prev, { role: "agent", text: "Hello! I'm your HedePay payroll agent. I can help disburse salaries, check policies, or review audit logs. Active guardrails: 30,000 USDC max per transfer, 42 whitelisted employees." }]);
    } else if (cmdLower.includes("policy") || cmdLower.includes("guardrail") || cmdLower.includes("limit")) {
      await sleep(400);
      setMessages((prev) => [...prev, { role: "agent", text: "Active policies:\n- Max Spend Limit: 30,000 USDC per transfer\n- Employee Whitelist: 42 approved accounts\n- Department Scope: Engineering, Operations, Contractors\n- HCS Audit Hook: Live (all transactions logged immutably)" }]);
    } else if (cmdLower.includes("audit") || cmdLower.includes("log") || cmdLower.includes("hcs")) {
      await sleep(400);
      setMessages((prev) => [...prev, { role: "agent", text: `Recent audit events logged to HCS. Last payroll cycle recorded on Topic 0.0.895234. All transactions are immutable and verifiable on the Hedera network.` }]);
    } else {
      await sleep(400);
      setMessages((prev) => [...prev, { role: "agent", text: "I didn't recognize that command. Try saying:\n- \"Disburse monthly salaries to the Engineering department in USDC\"\n- \"Show active policies\"\n- \"View audit logs\"" }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
    <div className="app-shell dash-shell">
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="eyebrow">HedePay</span>
          <h1>Payroll Dashboard</h1>
        </div>
        <div className="dash-header-right">
          <span className="agent-badge">
            <span className="agent-dot" />
            Autonomous Mode
          </span>
          <button type="button" className="button-alt small" onClick={() => setView("landing")}>Sign out</button>
        </div>
      </header>

      <section className="guardrail-bar">
        {guardrails.map((g) => (
          <div key={g.label} className="guardrail-chip">
            <span className="guardrail-label">{g.label}</span>
            <strong>{g.value}</strong>
          </div>
        ))}
      </section>

      <div className="dash-layout">
        <div className="dash-main">
          <div className="chat-panel">
            <div className="chat-header">
              <h2>Conversational Agent</h2>
              <span className="chat-status">
                <span className={`status-indicator ${isProcessing || payrollRunActive ? "processing" : "idle"}`} />
                {isProcessing || payrollRunActive ? "Processing..." : "Ready"}
              </span>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  <div className="chat-msg-avatar">
                    {msg.role === "agent" ? "A" : "U"}
                  </div>
                  <div className="chat-msg-content">
                    <div className="chat-msg-role">{msg.role === "agent" ? "Payroll Agent" : "You"}</div>
                    <div className="chat-msg-text">{msg.text}</div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="chat-msg agent">
                  <div className="chat-msg-avatar">A</div>
                  <div className="chat-msg-content">
                    <div className="chat-msg-role">Payroll Agent</div>
                    <div className="typing-indicator">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
              <textarea
                className="chat-input"
                placeholder="e.g. Disburse monthly salaries to the Engineering department in USDC"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                disabled={isProcessing}
              />
              <button className="chat-send" onClick={handleSend} disabled={!input.trim() || isProcessing}>
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="dash-side">
          <div className="side-panel">
            <div className="side-panel-header">
              <h3>Active Guardrails</h3>
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

          <div className="side-panel">
            <div className="side-panel-header">
              <h3>Agent Activity</h3>
            </div>
            <div className="activity-feed">
              {activityFeed.map((event) => (
                <div key={event.id} className={`activity-item ${event.type}`}>
                  <span className="activity-icon">
                    {event.type === "policy" && "⚙"}
                    {event.type === "mpp" && "�"}
                    {event.type === "hcs" && "�"}
                    {event.type === "compliance" && "✓"}
                    {event.type === "approval" && "�"}
                  </span>
                  <div className="activity-content">
                    <p>{event.message}</p>
                    <span className="activity-time">{event.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="side-panel">
            <div className="side-panel-header">
              <h3>Recent Runs</h3>
            </div>
            <div className="table-list mini-table">
              <div className="table-row header-row">
                <span>Run</span>
                <span>Status</span>
                <span>Amount</span>
              </div>
              {payRuns.map((run) => (
                <div key={run.name} className="table-row mini-row">
                  <span className="mini-name">{run.name}</span>
                  <span className={`mini-status ${run.status === "Settled" ? "status-settled" : run.status === "Approved" ? "status-approved" : "status-review"}`}>{run.status}</span>
                  <span className="mini-amount">{run.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showHITL && (
        <div className="modal-overlay">
          <div className="modal-content hitl-modal">
            <div className="modal-icon">�</div>
            <h2>Human Approval Required</h2>
            <p className="hitl-desc">
              This transfer of <strong>{hitlDetails.amount}</strong> exceeds the daily limit.
            </p>
            <p className="hitl-reason">{hitlDetails.reason}</p>
            <p className="hitl-instruction">Please sign to approve or deny this transaction.</p>
            <div className="modal-actions">
              <button type="button" className="button-alt modal-btn" onClick={handleHITLDeny}>Deny</button>
              <button type="button" className="modal-btn modal-approve" onClick={handleHITLApprove}>Sign & Approve</button>
            </div>
          </div>
        </div>
      )}

      {showAuditConfirm && (
        <div className="modal-overlay">
          <div className="modal-content audit-modal">
            <div className="modal-icon">📋</div>
            <h2>Payroll Cycle Complete</h2>
            <div className="audit-detail">
              <p>Payroll Cycle <strong>#{payrollCycleId}</strong> immutably logged to HCS</p>
              <div className="hcs-topic">Topic {hcsTopic}</div>
            </div>
            <p className="audit-note">
              All transactions are verifiable on the Hedera network. Share this topic with your accounting team for reconciliation.
            </p>
            <div className="modal-actions">
              <button type="button" className="modal-btn modal-approve" onClick={() => setShowAuditConfirm(false)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (view === "landing") return renderLanding();
  if (view === "login") return renderAuthForm("login");
  if (view === "signup") return renderAuthForm("signup");
  return renderDashboard();
}

export default App;
