# **HedePay: The Autonomous Hedera Payroll Agent**

### **What is HedePay?**
**HedePay** is an autonomous financial agent built on the **Hedera Agent Kit (v4)** designed to automate enterprise payroll disbursements in HBAR and USDC. It transforms complex salary workflows into transparent, agentic operations, ensuring every payment is secure and verifiable across the Hedera network.

This project is submitted for the **"Hedera Policy Agent"** bounty, demonstrating practical use cases for AI agents purchasing real services while operating under runtime constraints.

---
The branch as of the hackathon submission deadline is :  **"setup"**
---

### **Table of Contents**
*   [Key Features](#key-features)
*   [Live Demo](https://hede-pay-fzt7q.ondigitalocean.app/)
*   [Tech Stack](#tech-stack)
*   [Project Structure](#project-structure)
*   [Getting Started](#getting-started)
*   [Bounty Compliance: Hooks & Policies](#bounty-compliance-hooks--policies)
*   [Usage Examples](#usage-examples)
*   [License](#license)

---

### **Key Features**
*   **Autonomous Payroll Execution:** Operates in `AgentMode.AUTONOMOUS` to handle multi-account salary disbursements using the operator's funded account.
*   **Governed Disbursements:** Every payout is strictly regulated by the **MaxRecipientsPolicy** to prevent massive unauthorized transfers and the **RejectToolPolicy** to explicitly disable high-risk actions.
*   **Immutable Audit Trails:** Powered by the **HcsAuditTrailHook**, every tool execution is logged to a specific **HCS Topic**, creating a permanent ledger of activity.
*   **x402-Gated API Integration:** Uses the **MPPX Hedera Plugin** to pay for third-party tax and compliance APIs in USDC before executing transfers.
*   **Multi-Model Support:** Native compatibility with **Ollama Cloud (minimax-m3)** for privacy-focused, GPU-offloaded execution.

---

### **Live Demo**
The HedePay agent is hosted and active for public testing at:
**[https://hede-pay-fzt7q.ondigitalocean.app/](https://hede-pay-fzt7q.ondigitalocean.app/)**

---

### **Tech Stack**
*   **Blockchain:** Hedera Network (Testnet).
*   **Framework:** Hedera Agent Kit.
*   **AI Orchestration:** LangChain.
*   **AI Models:** **Ollama Cloud (minimax-m3)**.
*   **Payments Protocol:** Machine Payments Protocol (MPPX) for 402-protected API calls.
*   **SDK:** Hiero SDK.

---

### **Project Structure**
HedePay uses a **pnpm monorepo** architecture to separate concerns:
*   `/apps/agent`: Core AI logic, hooks/policies registration, and Hedera toolkit configuration.
*   `/apps/web`: React-based dashboard for payroll management and HCS audit visualization.

---

### **Bounty Compliance: Hooks & Policies**
To meet the **Hedera Policy Agent** criteria, HedePay implements a layered defense system using native v4 classes:

*   **Audit Trail (HcsAuditTrailHook):** Ensures verifiable transparency by streaming metadata from every transaction to an HCS topic. This creates an immutable record that links agent actions to specific transaction IDs.
*   **Recipient Limits (MaxRecipientsPolicy):** Blocks any transfer or airdrop request that exceeds a defined number of payees, preventing accidental or unauthorized "mass drain" events.
*   **Safety Deny-List (RejectToolPolicy):** A restrictive guardrail that explicitly disables high-risk tools like `delete_account` or `freeze_token`, ensuring the agent cannot execute destructive actions regardless of its prompt.

---

### **Usage Examples**

#### **Transfers (HBAR / USDC)**

*   **Simple disbursement:**  
    *"Send 100 HBAR to 0.0.9821"*
    → Agent executes a single transfer. The `MaxRecipientsPolicy(2)` allows it; `HcsAuditTrailHook` logs the tx hash to the configured HCS topic.

*   **Batch payroll (within policy bounds):**  
    *"Disburse 1000 USDC to 0.0.9821 and 0.0.9822"*
    → Agent sends to both recipients in one transfer. The policy permits up to 5 recipients; the hook records every detail on-chain. *(Future: map department names to account lists for bulk disbursement by department.)*

*   **Blocked bulk transfer (policy enforcement):**  
    *"Send 50 HBAR to 0.0.9821, 0.0.9822, 0.0.9823, and 0.0.9824"*
    → Agent attempts the transfer, `MaxRecipientsPolicy` fires at `PRE_TOOL_EXECUTE` and throws `PolicyEvaluationError("Max recipients exceeded: 4 > 2")`. The agent surfaces the error and suggests splitting into smaller transfers.

*   **Dangerous tool blocked:**  
    *"Delete the account 0.0.9821"*  
    → `RejectToolPolicy` intercepts at `PRE_TOOL_EXECUTE` and rejects `deleteAccount` (and other blocked tools like `createTopic`, `freezeToken`) before any on-chain action occurs.

#### **MPP-Powered API Calls**

> **Note:** USDC is not deployed on Hedera testnet, so MPP payment flows (USDC transfers) will fail on testnet. To test locally, spin up the MPPX demo server which mocks the 402 challenge/response cycle. On mainnet, the same flow works with real USDC.

*   **One-shot API purchase:**  
    *"Use the MPP charge tool to call /openai/v1/chat/completions and summarize last month's payroll"*  
    → Agent invokes `mppx_hedera_charge_fetch_tool` → GETs the endpoint → if a 402 challenge is returned, the plugin auto-pays the USDC fee → retries with credential → returns the response.

*   **Session-based consumption:**  
    *"Open an MPP session to the tax compliance API, fetch the withholding rates for account 0.0.9821, then close the session"*  
    → Agent calls `session_open` (deposits USDC into escrow), then `session_fetch` (off-chain voucher <1ms), then `session_close` (settles on-chain, refunds unused deposit). *(Future: fetch rates for an entire department once account-group mappings are added.)*

#### **Audit & Compliance**

*   **HCS audit trail retrieval:**  
    *"Show me the recent audit trail logs from the HCS topic"*  
    → The agent queries the HCS topic (via `HcsAuditTrailHook`'s logger or direct SDK call) and returns the message history — each entry includes the tool invoked, timestamp, and transaction ID.

*   **Policy-aware workflow:**  
    *"Pay 100 USDC to 0.0.9821 and 0.0.9822, then log the audit trail and check the HCS topic for confirmation"*  
    → Agent transfers USDC (capped at 5 recipients per tx by policy), the hook automatically writes each tx to the HCS topic, and the agent reads back the topic to confirm immutability. *(Future: group account IDs into departments for bulk "pay Engineering" commands.)*

---

### **License**
This project is licensed under the **Apache 2.0 License**.