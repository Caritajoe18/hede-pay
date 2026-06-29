import express, { Request, Response } from 'express';
import { createAgent } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/ollama';
import { buildToolkit } from './agent.js';
import 'dotenv/config';

const app = express();

// CORS
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json());

// Build toolkit with hooks/policies, then get all 47 tools
const toolkit = buildToolkit(process.env.ACCOUNT_ID!, process.env.PRIVATE_KEY!);
const allTools = toolkit.getTools();

// LLM: Ollama (local) or OpenAI
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

// LangGraph ReAct agent with hooks already wired via context in toolkit
const agent = createAgent({
  model: llm,
  tools: allTools as any,

  systemPrompt: `You are HedePay, a payroll agent on the Hedera network. 
  Operator: ${process.env.ACCOUNT_ID}. 
  Your audit topic is ${process.env.HCS_TOPIC_ID}. Do NOT use the create_topic_tool.
  The HcsAuditTrailHook is already handling all logging to the specified topic automatically. Simply execute the HBAR transfers and confirm they were logged." 
   Guidelines:
     1. Use MPPX for any tax compliance API calls if requested.
      IMPORTANT: The HcsAuditTrailHook is ALREADY active. Do not ask the user for a topic ID or offer to create a new one. 
  Simply perform the requested transfers and confirm that the audit log has been sent to topic ${process.env.HCS_TOPIC_ID}.`,
});

app.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const response = await agent.invoke({
      messages: [{ role: 'user', content: message }],
    });

    // Check tool results for policy rejections
    const toolMessages = response.messages.filter((m: any) => m.type === 'tool');
    const errorResults: string[] = [];
    for (const msg of toolMessages) {
      try {
        const parsed = JSON.parse(msg.content as string);
        if ((parsed?.raw?.status && parsed.raw.status !== 'SUCCESS') || parsed?.raw?.error) {
          const errorMsg = parsed.humanMessage || parsed.raw.error || 'Unknown tool error';
          errorResults.push(`[${msg.name}] ${errorMsg}`);
        }
      } catch {
      }
    }

    if (errorResults.length > 0) {
      return res.status(500).json({
        error: 'Transaction Blocked or Failed',
        details: errorResults.join('\n'),
      });
    }

    // Return the final LLM response to the user
    const lastMessage = response.messages[response.messages.length - 1];
    res.json({ content: lastMessage.content });
  } catch (error: any) {
    res.status(500).json({
      error: "Transaction Blocked or Failed",
      details: error.message
    });
  }
});

app.get('/', async (_req: Request, res: Response) => {
  res.json(`HedePay Agent online`)
})
const port = Number(process.env.PORT) || 3001
app.listen(port, () => console.log(`HedePay Agent running on port ${port}`));
