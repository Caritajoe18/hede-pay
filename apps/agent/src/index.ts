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

const api = toolkit.getHederaAgentKitAPI();
console.log("[DIAG] Interceptor installed, api.context.hooks=", (api as any).context?.hooks?.length);

const origRun = api.run.bind(api);
api.run = async (method: string, arg: any) => {
  console.log("[DIAG] HederaAgentAPI.run called method=", method, "hooks=", (api as any).context?.hooks?.length);
  if ((api as any).context?.hooks) {
    for (const h of (api as any).context.hooks) {
      console.log("[DIAG]   hook:", (h as any).name || h.constructor?.name);
    }
  }
  const result = await origRun(method, arg);
  console.log("[DIAG] HederaAgentAPI.run completed method=", method, "result length=", result.length);
  return result;
};

const allTools = toolkit.getTools();
console.log("[DIAG] allTools count=", allTools.length);
for (const t of allTools) {
  console.log("[DIAG]   tool name=", t.name, "has invoke=", typeof (t as any).invoke, "has _call=", typeof (t as any)._call);
  // Intercept _call
  const origCall = (t as any)._call.bind(t);
  (t as any)._call = async (...args: any[]) => {
    console.log("[DIAG] _call INVOKED tool=", t.name, "arg keys=", Object.keys(args[0] || {}));
    const method = (t as any).method || t.name;
    console.log("[DIAG] _call method=", method);
    if ((api as any).context?.hooks) {
      for (const h of (api as any).context.hooks) {
        console.log("[DIAG] _call   hook:", (h as any).name || h.constructor?.name);
      }
    }
    const result = await origCall(...args);
    console.log("[DIAG] _call RETURNED tool=", t.name, "result length=", result?.length);
    return result;
  };
  // Intercept invoke
  const origInvoke = (t as any).invoke.bind(t);
  (t as any).invoke = async (...args: any[]) => {
    console.log("[DIAG] invoke CALLED tool=", t.name);
    const result = await origInvoke(...args);
    console.log("[DIAG] invoke RETURNED tool=", t.name);
    return result;
  };
}

let llm;

if (process.env.USE_OLLAMA === 'true') {
  const ollamaAPIKey = process.env.OLLAMA_API_KEY
  if (!ollamaAPIKey) {
    throw new Error("Ollama cloud provider not authorized")
  }
  llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL || "llama3.2:3b",
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  });
} else {
  llm = new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY
  });
}

const agent = createAgent({
  model: llm,
  tools: allTools as any,

  systemPrompt: `You are HedePay, a payroll agent on the Hedera network. 
  Operator: ${process.env.ACCOUNT_ID}. 
  Your audit topic is ${process.env.HCS_TOPIC_ID}. Do NOT use the create_topic_tool.
  The HcsAuditTrailHook is already handling all logging to the specified topic automatically. Simply execute the HBAR transfers and confirm they were logged." 
   Guidelines:
    2. MaxRecipientsPolicy: maximum 2 recipients total per request. If a request involves more than 2 recipients, you MUST NOT split it into multiple transfers. Instead, inform the user the request exceeds the limit and they must submit separate requests.
    3. Use MPPX for any tax compliance API calls if requested.
     IMPORTANT: The HcsAuditTrailHook is ALREADY active. Do not ask the user for a topic ID or offer to create a new one. 
  Simply perform the requested transfers and confirm that the audit log has been sent to topic ${process.env.HCS_TOPIC_ID}.`,
});
app.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  console.log("[DIAG] /chat called with message:", message);

  try {
    const response = await agent.invoke({
      messages: [{ role: 'user', content: message }],
    });

    console.log("[DIAG] response.messages types:", response.messages.map((m: any) => m.type).join(", "));
    console.log("[DIAG] response.messages content:", JSON.stringify(response.messages.map((m: any) => ({type: m.type, name: m.name, content: typeof m.content === 'string' ? m.content.substring(0,200) : 'non-string'}))));
    
    const toolMessages = response.messages.filter((m: any) => m.type === 'tool');
    console.log("[DIAG] toolMessages count:", toolMessages.length);
    for (const m of toolMessages) console.log("[DIAG]   tool:", m.name, "content:", typeof m.content === 'string' ? m.content.substring(0,300) : 'non-string');
    
    const errorResults: string[] = [];
    for (const msg of toolMessages) {
      try {
        const parsed = JSON.parse(msg.content as string);
        if ((parsed?.raw?.status && parsed.raw.status !== 'SUCCESS') || parsed?.raw?.error) {
          const errorMsg = parsed.humanMessage || parsed.raw.error || 'Unknown tool error';
          errorResults.push(`[${msg.name}] ${errorMsg}`);
        }
      } catch {
        // not JSON, ignore
      }
    }
    if (errorResults.length > 0) {
      return res.status(500).json({
        error: 'Transaction Blocked or Failed',
        details: errorResults.join('\n'),
      });
    }

    const lastMessage = response.messages[response.messages.length - 1];
    res.json({ content: lastMessage.content });
  } catch (error: any) {
    res.status(500).json({
      error: "Transaction Blocked or Failed",
      details: error.message
    });
  } finally {
  }
});

app.post('/test-hooks', async (_req: Request, res: Response) => {
  console.log("[DIAG] /test-hooks called - testing hooks directly");
  try {
    const result = await api.run('get_hbar_balance_query_tool', { accountId: process.env.ACCOUNT_ID! });
    console.log("[DIAG] /test-hooks result:", result);
    res.json({ result });
  } catch (err: any) {
    console.error("[DIAG] /test-hooks error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', async (_req: Request, res: Response) => {
  res.json(`HedePay Agent online`)
})
const port = Number(process.env.PORT) || 3001
app.listen(port, () => console.log(`HedePay Agent running on port ${port}`));
