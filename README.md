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
*   **Disbursement:** *"Disburse monthly salaries to all employees, but ensure we don't exceed the 5-recipient policy limit."*
*   **Compliance:** *"Use the tax compliance API to calculate withholdings before processing the HBAR transfer."*
*   **Audit:** *"Provide the HCS message records for the last successful payroll execution."*

---

### **License**
This project is licensed under the **Apache 2.0 License**.