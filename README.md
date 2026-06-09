# VeHERify: Tracing the Untraceable

Welcome to the **VeHERify (powered by HEDERA 😊). This detective built for the Hedera network, designed to uncover the origins of images and videos even when their metadata has been stripped or their sources deliberately obscured.

---

## What is an "AI Agent"? (For the Uninitiated)
If you’ve used chatbots like Gemini or ChatGPT, you know they are great at talking. An **AI Agent**, however, is a chatbot with **"hands and a wallet."** 

Instead of just answering questions, this agent can:
*   **Take Action:** It can perform deep-web searches and use forensic tools autonomously.
*   **Transact:** It has a digital wallet to pay for API services or receive payments in HBAR.
*   **Remember Verifiably:** It records its findings on a public ledger (Hedera) so they can never be tampered with or deleted.

---

## Project Overview (For the Developers)
This is a **monorepo** containing a frontend and a Node.js/TypeScript backend powered by the **Hedera Agent Kit**. The agent leverages advanced OSINT (Open-Source Intelligence) tools and vision-capable LLMs to trace media origins.

### **Core Stack**
*   **Framework:** [Hedera Agent Kit (JS)](https://github.com/hashgraph/hedera-agent-kit-js).
*   **Network:** Hedera (HCS for audit trails, HTS for asset verification).
*   **Payment Gating:** Machine Payments Protocol (MPP) for pay-per-search functionality.
*   **Standards:** Integrated with ACP (Agentic Commerce Protocol) and AP2 (Agent Payments Protocol) for interoperable agentic commerce.

---

## Key Features

### **1. Pay-Per-Forensics (MPP Integration)**
Using the **Machine Payments Protocol**, the agent implements a "charge" model. Users pay a specific amount of HBAR to trigger a "Deep Search" workflow. This uses the **HTTP 402 "Payment Required"** scheme to ensure the service is only rendered upon successful transaction.

### **2. Verifiable Audit Trails (HCS)**
Every search result and origin proof is hashed and submitted to a **Hedera Consensus Service (HCS) Topic**. This creates a transparent, immutable record of the forensic process, preventing "fake news" or tampered evidence.

### **3. Autonomous Discovery (ACP & AP2)**
*   **ACP:** Our agent is discoverable by other shopping or research agents, allowing it to act as a sub-service in larger automated workflows.
*   **AP2:** Ensures secure, interoperable payment requests between the agent's UI and the user's wallet.

### **4. Security Guardrails**
We use **Hooks and Policies** to ensure the agent doesn't overspend its budget or access unauthorized tools, enforcing business logic directly at the code level.

---

## 📂 Repository Structure
```text
/veherify
├── /apps
│   ├── /web        # Frontend app (UI, wallet integration, chat interface)
│   └── /agent      # Backend app (Hedera Agent Kit, forensic workflows, HCS logging)
├── /packages
│   ├── /shared     # Shared types, protocol schemas, and utilities
│   └── /ui         # Shared UI components and design system pieces
└── package.json    # Root workspace configuration
```

This repository uses an npm workspace layout, so each app can be developed and deployed independently while sharing common code.

---

## 🚀 Getting Started

### **Prerequisites**
*   Node.js v18+
*   A **Hedera Testnet Account** ([Get one here](https://portal.hedera.com/)).
*   API keys for your LLM provider (OpenAI, Anthropic, Groq, etc.).

### **Quick Start**
1.  **Clone the repo:**
    ```bash
    git clone https://github.com/Caritajoe18/veherify.git
    cd veherify
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment files:**
    ```bash
    cp apps/agent/.env.example apps/agent/.env
    cp apps/web/.env.example apps/web/.env
    ```
4.  **Edit app env files:**
    - `apps/agent/.env` should contain backend-only secrets like `ACCOUNT_ID`, `PRIVATE_KEY`, and API keys.
    - `apps/web/.env` should only contain frontend-safe public values.

5.  **Run each app separately:**
    - Backend:
      ```bash
      cd apps/agent
      npm run dev
      ```
    - Frontend:
      ```bash
      cd apps/web
      npm run dev
      ```

---

## 📜 License
This project is licensed under the **Apache 2.0 License**.
