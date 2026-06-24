# **HedePay: The Autonomous Hedera Payroll Agent**

**HedePay** is a governed, autonomous financial agent built using the **Hedera Agent Kit (v4)**. It is designed to automate enterprise payroll disbursements in HBAR and USDC while enforcing strict compliance via **Hooks and Policies**. By leveraging the **Hedera Consensus Service (HCS)** for immutable audit trails and the **Machine Payments Protocol (MPP)** for tax compliance APIs, HedePay ensures that every salary payment is verifiable, transparent, and secure.

This project is submitted for the **"Hedera Policy Agent"** bounty, demonstrating practical use cases for AI agents purchasing real services while operating under runtime constraints.

---

### **Table of Contents**
*   [Key Features](#key-features)
*   [Live Demo](#live-demo)
*   [Tech Stack](#tech-stack)
*   [Project Structure](#project-structure)
*   [Getting Started](#getting-started)
*   [Bounty Compliance: Hooks & Policies](#bounty-compliance-hooks--policies)
*   [Usage Examples](#usage-examples)
*   [License](#license)

---

### **Key Features**
*   **Autonomous Payroll Execution:** Operates in `AgentMode.AUTONOMOUS` to handle multi-account salary disbursements without constant manual intervention.
*   **Policy-Governed Disbursements:** Implements **MaxSpendPolicies** and **WhitelistPolicies** to prevent overspending and ensure funds are only sent to authorized employee accounts.
*   **Immutable Audit Trails:** Every payroll cycle and policy denial is logged to a specific **HCS Topic**, creating a permanent ledger of corporate financial activity.
*   **x402-Gated API Integration:** Uses the **MPPX Hedera Plugin** to pay for third-party tax and compliance APIs in HBAR/USDC before executing transfers.
*   **Multi-Model Support:** Compatible with **OpenAI (GPT-4o)**, **Groq**, and **Ollama** for local or cloud-based execution.

---

### **Live Demo**
The HedePay agent is hosted and active for public testing at:
**[https://hede-pay-fzt7q.ondigitalocean.app/](https://hede-pay-fzt7q.ondigitalocean.app/)**

---

### **Tech Stack**
*   **Blockchain:** Hedera Network (Testnet).
*   **Framework:** Hedera Agent Kit v4.
*   **AI Orchestration:** LangChain v1.
*   **AI Models:** **Ollama Cloud (minimax-m3)**
*   **Payments Protocol:** Machine Payments Protocol (MPPX) for 402-protected API calls.
*   **SDK:** Hiero SDK.

---

### **Project Structure**
HedePay uses a **pnpm monorepo** architecture to separate concerns between the AI logic and the user interface:
*   `/apps/agent`: Core AI logic and Hedera toolkit configuration.
*   `/apps/web`: React-based dashboard for payroll management and HCS audit visualization.

---

### **Getting Started**
#### **1. Prerequisites**
*   **Node.js** v20 or higher.
*   A **Hedera Testnet Account** (Get one at [portal.hedera.com](https://portal.hedera.com)).
*  Ollma API Key (for ollama cloud access ) or **Ollama** installed for local access.

#### **2. Installation**
```bash
npm install
```

#### **3. Environment Configuration**
Create a `.env` file in `/apps/agent` including your `ACCOUNT_ID`, `PRIVATE_KEY`, and `HCS_TOPIC_ID`.

---

### **Bounty Compliance: Hooks & Policies**
To meet the **Hedera Policy Agent** criteria, HedePay implements a layered defense system:

*   **The Spend Limit Policy:** The agent is restricted by a **MaxSpendPolicy** that blocks any single disbursement exceeding a defined USDC threshold, preventing accidental massive outflows.
*   **The Employee Whitelist:** Using the **WhitelistPolicy**, the agent can only interact with the `CoreTransferPlugin` if the `targetAccountId` exists within the corporate employee directory.
*   **Audit Hook:** Every action—whether successful or blocked by a policy—is processed through a **BaseTool-enhanced hook** that submits the transaction record to **HCS**, ensuring verifiable and transparent behavior.

---

### **Usage Examples**
*   **Disbursement:** *"Disburse monthly salaries to all employees in the 'Engineering' whitelist."*
*   **Compliance:** *"Check the tax compliance API for the next payroll cycle using USDC."*
*   **Balance:** *"What is the remaining payroll budget in HBAR?"*
*   **Audit:** *"Show me the HCS message records for the last payroll execution."*

---

### **License**
This project is licensed under the **Apache 2.0 License**.