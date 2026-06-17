import { Client, PrivateKey } from '@hiero-ledger/sdk';
import { AgentMode } from '@hashgraph/hedera-agent-kit';

// 1. Import ONLY the query plugin to save RAM and CPU cycles
import { coreAccountQueryPlugin } from '@hashgraph/hedera-agent-kit/plugins';

import { HederaLangchainToolkit } from '@hashgraph/hedera-agent-kit-langchain';
import { createAgent } from 'langchain';
import { ChatOllama } from '@langchain/ollama';
import 'dotenv/config';

const hederaAccountId = process.env.ACCOUNT_ID;
const hederaPrivateKey = process.env.PRIVATE_KEY;
console.log(hederaAccountId, hederaPrivateKey)

if (!hederaAccountId || !hederaPrivateKey) {
  throw new Error('Please set ACCOUNT_ID and PRIVATE_KEY in your environment variables.');
}

const client = Client.forTestnet().setOperator(
   process.env.ACCOUNT_ID!,
  PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY!),
);

// 2. Pass ONLY the query plugin into the configuration
const toolkit = new HederaLangchainToolkit({
  client,
  configuration: {
    tools: [],
    plugins: [coreAccountQueryPlugin], // <--- Swapped from allCorePlugins
    context: { mode: AgentMode.AUTONOMOUS },
  },
});

const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
const ollamaModel = process.env.OLLAMA_MODEL ?? 'llama3.2:3b'; // <--- Ensure this points to your 3B model

const model = new ChatOllama({
  model: ollamaModel,
  baseUrl: ollamaBaseUrl,
});

const agent = createAgent({
  model,
  tools: toolkit.getTools() as unknown as any[],
  systemPrompt: `You are a helpful assistant with access to Hedera blockchain tools. 
The user's Hedera Account ID is ${hederaAccountId}. 
When the user asks for 'my' balance or info, strictly use this account ID (${hederaAccountId}) 
for the 'accountId' parameter.`,
});

console.log("Asking agent for balance...");
const response = await agent.invoke({
  messages: [{ role: 'user', content: "What's my HBAR balance?" }],
});

console.log(response.messages[response.messages.length - 1].content);
