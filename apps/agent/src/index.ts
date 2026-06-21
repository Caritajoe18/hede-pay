import cors from 'cors';
import express, { Request, Response } from 'express';
import { createAgent } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/ollama';
import { buildToolkit } from './agent.js';
import 'dotenv/config';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
}));

app.use(express.json());

const toolkit = buildToolkit(process.env.ACCOUNT_ID!, process.env.PRIVATE_KEY!);

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

// 4. Initialize the agent using the createAgent pattern
const agent = createAgent({
  model: llm, // createAgent uses 'model' instead of 'llm'
  tools: toolkit.getTools() as any,
  // createAgent uses 'systemPrompt' instead of 'messageModifier'
  systemPrompt: `You are HedePay, a payroll agent on the Hedera network. 
  Operator: ${process.env.ACCOUNT_ID}. 
  Always use HCS to log disbursements and MPPX for tax API calls.`,
});

app.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const response = await agent.invoke({
      messages: [{ role: 'user', content: message }],
    });

    // Return the final message to the UI
    const lastMessage = response.messages[response.messages.length - 1];
    res.json({ content: lastMessage.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//test route
app.get('/', async (req: Request, res: Response) => {
  res.json(`HedePay Agent online`)
})
const port = Number(process.env.PORT) || 3001
app.listen(port, () => console.log(`HedePay Agent running on port ${port}`));