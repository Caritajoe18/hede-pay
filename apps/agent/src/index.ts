import express, { Request, Response } from 'express';
import { createAgent } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/ollama';
import { buildToolkit } from './agent.js';
import 'dotenv/config';

const app = express();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json());

const toolkit = buildToolkit(process.env.ACCOUNT_ID!, process.env.PRIVATE_KEY!);

const tools = toolkit.getTools();


// 3. LLM selection logic for local or Cloud Ollama
let llm;

if (process.env.USE_OLLAMA === 'true') {
  const ollamaAPIKey = process.env.OLLAMA_API_KEY
  if (!ollamaAPIKey) {
    throw new Error("Ollama cloud provider not authorized")
  }
  llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL || "llama3.2:3b",
    // For Cloud Tier, use https://ollama.com/api
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  });
} else {
  llm = new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY
  });
}
console.log(`[DEBUG] Toolkit initialized with ${tools.length} tools.`);

const testTool = tools.find(t => t.name === 'transfer_hbar_tool');
if (testTool) {
    // Accessing the internal API context to see if hooks reached the tool
    const hooksCount = (testTool as any).hederaAPI?.context?.hooks?.length;
    console.log(`[DEBUG] Tool 'transfer_hbar_tool' registered with ${hooksCount || 0} hooks.`);

    
    if (!hooksCount) {
        console.warn("CRITICAL: Hooks are MISSING from the tool context. Enforcement will fail.");
    }
}
// 4. Initialize the agent using the createAgent pattern
const agent = createAgent({
  model: llm,
  tools: toolkit.getTools() as any,

  systemPrompt: `You are HedePay, a payroll agent on the Hedera network. 
  Operator: ${process.env.ACCOUNT_ID}. 
  Your audit topic is ${process.env.HCS_TOPIC_ID}. Do NOT use the create_topic_tool.
  The HcsAuditTrailHook is already handling all logging to the specified topic automatically. Simply execute the HBAR transfers and confirm they were logged." 
   Guidelines:
  2. Respect the MaxRecipientsPolicy. If a request exceeds your limit, inform the user and suggest splitting the task.
  3. Use MPPX for any tax compliance API calls if requested.
   IMPORTANT: The HcsAuditTrailHook is ALREADY active. Do not ask the user for a topic ID or offer to create a new one. 
  Simply perform the requested transfers and confirm that the audit log has been sent to topic ${process.env.HCS_TOPIC_ID}.`,
});

app.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  console.log(`[REQUEST] User Message: "${message}"`);


  try {
    const response = await agent.invoke({
      messages: [{ role: 'user', content: message }],
    });
    // DEBUG: Inspect the tool calls made by the LLM
    const toolCalls = response.messages.filter((m: any) => m.tool_calls);
    toolCalls.forEach((m: any) => {
      m.tool_calls.forEach((call: any) => {
        console.log(`[DEBUG] LLM INVOKED: ${call.name}`);
        console.log(`[DEBUG] PARAMETERS:`, JSON.stringify(call.args, null, 2));
      });
    });


    // Return the final message to the UI
    const lastMessage = response.messages[response.messages.length - 1];
    res.json({ content: lastMessage.content });
  } catch (error: any) {
    // ADDED: Detailed console logging for transparency as requested
    console.error("--- HEDEPAY AGENT ERROR ---");
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(`User Message: ${message}`);
    console.error(`Error Type: ${error.name || 'Unknown'}`);
    console.error(`Details: ${error.message}`);

    // If it's a policy violation, the error message will specify the guardrail
    if (error.message.includes('Policy')) {
      console.error("ALERT: Guardrail violation detected and blocked.");
    }
    console.error("---------------------------");

    res.status(500).json({
      error: "Transaction Blocked or Failed",
      details: error.message
    });
  }
});

//test route
app.get('/', async (req: Request, res: Response) => {
  res.json(`HedePay Agent online`)
})
const port = Number(process.env.PORT) || 3001
app.listen(port, () => console.log(`HedePay Agent running on port ${port}`));