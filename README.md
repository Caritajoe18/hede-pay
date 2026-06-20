# **HedePay: The Autonomous Hedera Payroll Agent**

**HedePay** is a governed, autonomous financial agent built using the **Hedera Agent Kit (v4)**. It is designed to automate enterprise payroll disbursements in HBAR and USDC while enforcing strict compliance via **Hooks and Policies**. By leveraging the **Hedera Consensus Service (HCS)** for immutable audit trails and the **Machine Payments Protocol (MPP)** for tax compliance APIs, HedePay ensures that every salary payment is verifiable, transparent, and secure.

This project is submitted for the **"Hedera Policy Agent"** bounty, demonstrating practical use cases for AI agents purchasing real services while operating under runtime constraints [Turn 18, Turn 24].

---

## ** Key Features**

*   **Autonomous Payroll Execution:** Operates in `AgentMode.AUTONOMOUS` to handle multi-account salary disbursements without constant manual intervention.
*   **Policy-Governed Disbursements:** Implements **MaxSpendPolicies** and **WhitelistPolicies** to prevent overspending and ensure funds are only sent to authorized employee accounts [39, Turn 24].
*   **Immutable Audit Trails:** Every payroll cycle and policy denial is logged to a specific **HCS Topic**, creating a permanent ledger of corporate financial activity [39, Turn 18].
*   **x402-Gated API Integration:** Uses the **MPPX Hedera Plugin** to pay for third-party tax and compliance APIs in HBAR/USDC before executing transfers [72, Turn 18].
*   **Multi-Model Support:** Compatible with **OpenAI (GPT-4o)**, **Groq**, and **Ollama** for 100% local, private execution.

---

## **📁 Project Structure**

HedePay uses a **pnpm monorepo** architecture to separate concerns between the AI logic and the user interface [34, Turn 19]:

```text
/hedepay
├── /apps
│   ├── /web        # Next.js Frontend (Payroll dashboard & policy status)
│   └── /agent      # Node.js Backend (HAK v4, LangChain, Payroll Logic)
├── /packages
│   ├── /shared     # Shared Zod schemas for payroll & employee records
│   └── /ui         # Shared UI components (Tailwind/Radix)
└── package.json    # Workspace configuration
```

---

## **🛠️ Tech Stack**

*   **Blockchain:** Hedera Network (Testnet).
*   **Framework:** [Hedera Agent Kit v4](https://github.com/hashgraph/hedera-agent-kit-js).
*   **AI Orchestration:** [LangChain v1](https://github.com/langchain-ai/langchain).
*   **Payments Protocol:** [Machine Payments Protocol (MPPX)](https://mpp.dev) for 402-protected API calls.
*   **SDK:** [Hiero SDK](https://github.com/hashgraph/hedera-sdk-js).

---

## **⚙️ Getting Started**

### **1. Prerequisites**
*   **Node.js** v20 or higher.
*   A **Hedera Testnet Account** (Get one at [portal.hedera.com](https://portal.hedera.com/dashboard)).
*   An LLM API Key (OpenAI/Groq) or **Ollama** installed locally.

### **2. Installation**
```bash
# Install core dependencies across the monorepo
npm install @hashgraph/hedera-agent-kit @hashgraph/hedera-agent-kit-langchain @hiero-ledger/sdk
```

### **3. Environment Configuration**
Create a `.env` file in `/apps/agent`:
```env
ACCOUNT_ID=0.0.xxxxxx
PRIVATE_KEY=302e...
HEDERA_NETWORK=testnet
OPENAI_API_KEY=sk-... # Or GROQ_API_KEY
```

---

## ** Bounty Compliance: Hooks & Policies**

To meet the **Hedera Policy Agent** criteria, HedePay implements a layered defense system :

### **The Spend Limit Policy**
The agent is restricted by a **MaxSpendPolicy** that blocks any single disbursement exceeding a defined USDC threshold. This prevents accidental massive outflows [39, Turn 24].

### **The Employee Whitelist**
Using the **WhitelistPolicy**, the agent can only interact with the `CoreTransferPlugin` if the `targetAccountId` exists within the corporate employee directory [Turn 18, Turn 24].

### **Audit Hook**
Every action—whether successful or blocked by a policy—is processed through a **BaseTool-enhanced hook** that submits the transaction record to **HCS**. This ensures "verifiable and transparent" behavior as required by the AI Studio.

---

## **📖 Usage Examples**

Once the agent is running in its REPL or connected to the web UI, you can issue commands such as:

*   **Disbursement:** *"Disburse monthly salaries to all employees in the 'Engineering' whitelist."*
*   **Compliance:** *"Check the tax compliance API for the next payroll cycle using USDC."*
*   **Balance:** *"What is the remaining payroll budget in HBAR?"*
*   **Audit:** *"Show me the HCS message records for the last payroll execution."*

---

## **📝 Feedback & Hosting**

*   **Feedback:** A detailed developer experience report is included in `FEEDBACK.md` [Turn 21].
*   **Live Demo:** The agent is hosted at `[YOUR_DEPLOYED_URL]` and will remain active for at least 90 days following submission [Turn 18].

---

## **⚖️ License**
This project is licensed under the **Apache 2.0 License**.