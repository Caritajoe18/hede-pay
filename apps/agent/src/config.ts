import 'dotenv/config';

export const env = {
  // --- Hedera credentials ---
  accountId: envRequired('ACCOUNT_ID'),
  privateKey: envRequired('PRIVATE_KEY'),
  network: (process.env.HEDERA_NETWORK ?? 'testnet') as 'testnet' | 'mainnet',

  // --- LLM provider (choose one) ---
  openaiApiKey: process.env.OPENAI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  useOllama: process.env.USE_OLLAMA === 'true',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL ?? 'llama3.2:3b',
};

function envRequired(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}
