import { useState, useRef, useEffect, useCallback } from "react";

const MPP_TOOLS = [
  {
    id: "charge_fetch",
    name: "One-Shot API Payment",
    tool: "mppx_hedera_charge_fetch_tool",
    description: "Call a 402-protected API, auto-pay with USDC, return the data",
    params: "url, method, body, maxAmount",
  },
  {
    id: "session_open",
    name: "Open Payment Channel",
    tool: "mppx_hedera_session_open_tool",
    description: "Deposit USDC into escrow for fast session-based API calls",
    params: "url, deposit",
  },
  {
    id: "session_fetch",
    name: "Session API Call",
    tool: "mppx_hedera_session_fetch_tool",
    description: "Make an API call using an open session (off-chain voucher, <1ms)",
    params: "url, method, body",
  },
  {
    id: "session_close",
    name: "Close Payment Channel",
    tool: "mppx_hedera_session_close_tool",
    description: "Settle on-chain, refund unused deposit",
    params: "url",
  },
];
type PayRun = {
  name: string;
  status: string;
  amount: string;
};

const MPP_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const SAMPLE_ENDPOINTS = [
  {
    id: "tax",
    name: "Tax Compliance API (Payroll)",
    url: "https://api.tax-compliance-provider.com/v1/payroll",
    displayUrl: "api.tax-compliance-provider.com/v1/payroll",
    cost: "TBD",
    icon: "📊",
  },
  {
    id: "openai",
    name: "OpenAI Proxy (Chatbot)",
    url: `${MPP_BASE}/openai/v1/chat/completions`,
    displayUrl: "/openai/v1/chat/completions",
    cost: "$0.005",
    icon: "🤖",
  },
  {
    id: "stripe",
    name: "Stripe Proxy (Payment Processing)",
    url: `${MPP_BASE}/stripe/v1/charges`,
    displayUrl: "/stripe/v1/charges",
    cost: "$0.01",
    icon: "💳",
  },
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
  const [hbarBalance, setHbarBalance] = useState("Loading...");
  const [maxSpendLimit, setMaxSpendLimit] = useState("30,000 USDC per transfer");

  const fetchBalance = async () => {
    setHbarBalance("Loading...");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "What is my current HBAR balance?" }),
      });
      const data = await response.json();
      setHbarBalance(data.content);
    } catch (e) {
      setHbarBalance("Connection Error");
    }
  };

  const fetchRecentRuns = useCallback(async () => {
    setIsFetchingRuns(true);
    try {
      const topicId = import.meta.env.VITE_HCS_TOPIC || "0.0.9298689";
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `List recent payroll runs from HCS topic ${topicId}. For each run give me the name, status, and amount. Format each as name|status|amount on a separate line.` }),
      });
      const data = await res.json();
      const lines: string[] = (data.content || "").split("\n").filter((l: string) => l.includes("|"));
      const runs: PayRun[] = lines.map((l: string) => {
        const [name, status, amount] = l.split("|").map((s: string) => s.trim());
        return { name, status, amount };
      }).filter((r: PayRun) => r.name && r.status && r.amount);
      if (runs.length > 0) setPayRuns(runs);
    } catch {
      // silent — keep empty state
    } finally {
      setIsFetchingRuns(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchRecentRuns();
  }, [fetchRecentRuns]);

  const guardrails = [
    { label: "Max Recipients", value: "5 per transfer" },
    { label: "Blocked Tools", value: "create_topic, delete_account" },
    { label: "HCS Audit Topic", value: import.meta.env.VITE_HCS_TOPIC || "0.0.9298689" },
  ];

  const getViewFromHash = (): "landing" | "login" | "signup" | "dashboard" => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "login") return "login";
    if (hash === "signup") return "signup";
    if (hash === "dashboard") return "dashboard";
    return "landing";
  };
  const [view, setView] = useState<"landing" | "login" | "signup" | "dashboard">(getViewFromHash);
  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    setView(to as any);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "Welcome to HedePay. I'm your payroll agent.\n\nHere's what I can do:\n• Pay salaries in USDC or HBAR to any Hedera account\n• Enforce safety policies (max 5 recipients per transfer, dangerous tools blocked)\n• Log every action to an immutable HCS audit trail\n• Fetch data from paid external services — for example, I can call a tax API to calculate withholdings, query an AI service to generate payroll summaries, or verify employee identities through a verification service. Just select an endpoint from the gallery or tell me which service to call.\n\nHow would you like to proceed?",
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
  const [mppServices, setMppServices] = useState(MPP_TOOLS);
  const [isCheckingPrice, setIsCheckingPrice] = useState(false);
  const [selectedService, setSelectedService] = useState(MPP_TOOLS[0]);
  const [auditLogs, setAuditLogs] = useState<string | null>(null);
  const [payRuns, setPayRuns] = useState<PayRun[]>([]);
  const [isFetchingRuns, setIsFetchingRuns] = useState(false);
  const [isFetchingAudit, setIsFetchingAudit] = useState(false);
  const [runningEndpoint, setRunningEndpoint] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onHashChange = () => navigate(getViewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const addActivity = (type: ActivityEvent["type"], message: string) => {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setActivityFeed((prev) => [{ id: nextActivityId, type, message, timestamp }, ...prev]);
    setNextActivityId((id) => id + 1);
  };

  const handlePriceCheck = async (serviceId: string) => {
    const service = mppServices.find(s => s.id === serviceId);
    if (!service || isCheckingPrice) return;

    setIsCheckingPrice(true);
    addActivity("mpp", `Checking price for ${service.name}...`);

    try {
      const prompt = `Use the ${service.tool} tool. Call it and tell me the cost or result.`;

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();

      setMppServices(prev => prev.map(s =>
        s.id === serviceId ? { ...s, cost: data.content } : s
      ));

      addActivity("mpp", `Service Cost Reported: ${data.content}`);
      setMessages(prev => [...prev, { role: "agent", text: `The result for ${service.name} is ${data.content}.` }]);
    } catch (error) {
      addActivity("policy", "Price check failed or service unavailable.");
    } finally {
      setIsCheckingPrice(false);
    }
  };

  const executeServicePayment = async () => {
    addActivity("mpp", `Executing ${selectedService.name} via ${selectedService.tool}`);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Use the ${selectedService.tool} tool to call a test endpoint and tell me the result` }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", text: data.content }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "agent", text: `Error: ${error.message}` }]);
    }
  };

  const handleRunEndpoint = async (ep: typeof SAMPLE_ENDPOINTS[number]) => {
    setRunningEndpoint(ep.id);
    addActivity("mpp", `Agent fetching ${ep.name} via MPP charge...`);
    const prompt = `Use the mppx_hedera_charge_fetch_tool to call ${ep.url} with method GET. If there is a 402 payment challenge, pay it automatically and return the response data.`;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      addActivity("mpp", `${ep.name} responded`);
      setMessages((prev) => [...prev, { role: "agent", text: data.content }]);
    } catch {
      addActivity("policy", `Failed to fetch ${ep.name}`);
    } finally {
      setRunningEndpoint(null);
    }
  };

  const fetchAuditLogs = async () => {
    setIsFetchingAudit(true);
    addActivity("hcs", "Requesting audit logs from HCS topic...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Show me the recent audit trail logs from the HCS topic. What transactions have been logged?" }),
      });
      const data = await res.json();
      setAuditLogs(data.content);
      addActivity("hcs", "Audit logs retrieved");
      setMessages((prev) => [...prev, { role: "agent", text: data.content }]);
    } catch (error: any) {
      addActivity("hcs", "Failed to fetch audit logs");
    } finally {
      setIsFetchingAudit(false);
    }
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
    addActivity("compliance", `Total ${totalAmount.toLocaleString()} ${currency} — checking against ${maxSpendLimit}`);
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
    setIsProcessing(true);
    addActivity("compliance", `Processing command: "${cmd}"`);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cmd }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Request failed");
      }

      const data = await res.json();
      const agentText = typeof data.content === "string" ? data.content : JSON.stringify(data.content);
      setMessages((prev) => [...prev, { role: "agent", text: agentText }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "agent", text: `Error: ${error.message}` }]);
    } finally {
      setIsProcessing(false);
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
          <button type="button" className="button-alt" onClick={() => navigate("login")}>Login</button>
          <button type="button" onClick={() => navigate("signup")}>Sign Up</button>
        </div>
      </nav>

      <header className="hero-panel landing-hero" id="home">
        <div>
          <span className="eyebrow">HedePay</span>
          <h1>Autonomous payroll for Hedera-native enterprises</h1>
          <p>
            HedePay automates payroll disbursements using Hedera policies and immutable HCS audit trails. The result is secure salary payment, compliance enforcement, and transparent reporting in a single enterprise dashboard.
          </p>
          <h3>Note: User Authentication is still open, just login with any random email and password to access the agent</h3>
          <div className="hero-actions landing-actions">
            <button type="button" onClick={() => navigate("signup")}>Get started</button>
            <button type="button" className="button-alt" onClick={() => navigate("login")}>Login</button>
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
            HedePay is an autonomous financial agent built on the Hedera Agent Kit designed to automate enterprise payroll disbursements in HBAR and USDC. It transforms complex salary workflows into transparent, agentic operations, ensuring every payment is secure and verifiable across the Hedera network. </p>
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
          <p>Every payout is strictly regulated by the MaxRecipientsPolicy to prevent massive unauthorized transfers and the RejectToolPolicy to explicitly disable high-risk actions
            . This ensures that only authorized, controlled distributions occur. </p>
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
          <button type="button" onClick={() => navigate("signup")}>Create account</button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="eyebrow">HedePay</span>
            <p>Autonomous payroll for Hedera-native enterprises.</p>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-copy">
            <p>&copy; 2026 HedePay. Built on Hedera.</p>
          </div>
        </div>
      </footer>
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
            <button type="button" className="button-alt small" onClick={() => navigate("landing")}>Back</button>
          </div>
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); navigate("dashboard"); }}>
            <label>
              <p>(sign in with a random email and password, auth is still open)</p>
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
          <button type="button" className="button-alt small" onClick={() => navigate("landing")}>Sign out</button>
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
              <h3>Autonomous Compliance & Service Fetching</h3>
            </div>
            <p className="text-small" style={{marginBottom:'14px',color:'var(--muted)'}}>Select an endpoint and the agent will fetch it via MPP — it handles 402 payment challenges automatically.</p>
            <p className="text-small" style={{marginBottom:'14px',padding:'10px',borderRadius:'12px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)',color:'#b91c1c',fontSize:'0.78rem',lineHeight:1.5}}>Note: USDC is not enabled on Hedera testnet, so MPP payment flows will fail. These samples demonstrate the intended flow for mainnet deployment.</p>
            <div className="gallery-cards">
              {SAMPLE_ENDPOINTS.map((ep) => (
                <div key={ep.id} className={`endpoint-card ${runningEndpoint === ep.id ? "loading" : ""}`}>
                  <span className="endpoint-icon">{ep.icon}</span>
                  <div className="endpoint-info">
                    <strong>{ep.name}</strong>
                    <span className="endpoint-url">{ep.displayUrl}</span>
                    <span className="endpoint-cost">Cost: {ep.cost}</span>
                  </div>
                  <button
                    className="endpoint-run-btn"
                    onClick={() => handleRunEndpoint(ep)}
                    disabled={runningEndpoint !== null}
                  >
                    {runningEndpoint === ep.id ? "Running..." : "Run"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="side-panel">
            <div className="side-panel-header">
              <h3>Audit Trail</h3>
              <button
                type="button"
                className="button-alt small"
                onClick={fetchAuditLogs}
                disabled={isFetchingAudit}
              >
                {isFetchingAudit ? "Fetching..." : "View Logs"}
              </button>
            </div>
            {auditLogs ? (
              <p className="text-small" style={{lineHeight:1.6,fontSize:'0.82rem'}}>{auditLogs}</p>
            ) : (
              <p className="text-small" style={{color:'var(--muted)'}}>Click "View Logs" to fetch the HCS audit trail from the agent.</p>
            )}
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
              <button type="button" className="button-alt small" onClick={fetchRecentRuns} disabled={isFetchingRuns}>
                {isFetchingRuns ? "Loading..." : "Refresh"}
              </button>
            </div>
            <div className="table-list mini-table">
              <div className="table-row header-row">
                <span>Run</span>
                <span>Status</span>
                <span>Amount</span>
              </div>
              {payRuns.length === 0 ? (
                <p className="text-small" style={{color:'var(--muted)',padding:'12px 14px'}}>
                  {isFetchingRuns ? "Loading..." : "No runs yet"}
                </p>
              ) : (
                payRuns.map((run, i) => (
                  <div key={i} className="table-row mini-row">
                    <span className="mini-name">{run.name}</span>
                    <span className={`mini-status ${run.status === "Settled" ? "status-settled" : run.status === "Approved" ? "status-approved" : "status-review"}`}>{run.status}</span>
                    <span className="mini-amount">{run.amount}</span>
                  </div>
                ))
              )}
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
