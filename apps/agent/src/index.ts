#!/usr/bin/env node

import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGroq } from '@langchain/groq';
import { createAgent } from 'langchain';

import { env } from './config.js';
import { buildClient, buildToolkit } from './agent.js';

async function main() {
  // ── 1. Hedera client & toolkit with manually selected plugins ──
  const client = buildClient();
  const toolkit = buildToolkit(client);
  const tools = toolkit.getTools() as any[];

  // ── 2. LLM — choose provider ──
  let llm;

  if (env.useOllama) {
    llm = new ChatOllama({
      model: env.ollamaModel,
      baseUrl: env.ollamaBaseUrl,
    });
  } else if (env.groqApiKey) {
    llm = new ChatGroq({
      model: 'llama-3.3-70b-versatile',
      apiKey: env.groqApiKey,
    });
  } else if (env.openaiApiKey) {
    llm = new ChatOpenAI({
      model: 'gpt-4o',
      apiKey: env.openaiApiKey,
    });
  } else {
    throw new Error('No LLM provider configured. Set USE_OLLAMA=true or provide an API key.');
  }

  // ── 3. Forensics agent ──
  const systemPrompt = [
    `You are VeHERify, a forensic AI agent on the Hedera network.`,
    `Your purpose is to trace the origin of digital media (images, video, audio)`,
    `and record every finding immutably on HCS (Hedera Consensus Service).`,
    ``,
    `Operator account: ${env.accountId} (${env.network}).`,
    ``,
    `Available tools:`,
    `- HCS (coreConsensusPlugin): create topics, submit messages (audit trail).`,
    `- MPP payments: charge-fetch for HBAR/USDC-gated forensic API searches,`,
    `  and session-open/fetch/close for high-volume gated queries.`,
    ``,
    `For every discovery:`,
    `  1. Analyse the media and gather evidence.`,
    `  2. Submit a structured forensic finding to an HCS topic.`,
    `  3. When accessing gated forensic APIs, use the MPPX payment tools.`,
    ``,
    `Always use the operator account ID (${env.accountId}) for 'accountId' parameters.`,
  ].join('\n');

  const agent = createAgent({
    model: llm,
    tools,
    systemPrompt,
  });

  // ── 4. REPL ──
  console.log('VeHERify agent ready (autonomous mode). Type a forensic query or /quit.');

  const readline = (await import('node:readline')).default.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  for await (const line of readline) {
    const input = line.trim();
    if (!input || input === '/quit') break;

    const response = await agent.invoke({
      messages: [{ role: 'user', content: input }],
    });

    const last = response.messages.at(-1);
    console.log(`\n${last?.content ?? '(empty response)'}\n`);
  }

  readline.close();
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
