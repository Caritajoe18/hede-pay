import { Client, PrivateKey } from '@hiero-ledger/sdk';
import { AgentMode } from '@hashgraph/hedera-agent-kit';
import { HederaLangchainToolkit } from '@hashgraph/hedera-agent-kit-langchain';

import { env } from './config.js';

// ── Manual plugin selection (keeps token count low ─ Turn 11 / Turn 13) ──
import { coreConsensusPlugin } from '@hashgraph/hedera-agent-kit/plugins';
import { mppxHederaPlugin } from 'hak-mppx-hedera-plugin';

export function buildClient(): Client {
  const client = Client.forName(env.network);
  client.setOperator(env.accountId, PrivateKey.fromStringECDSA(env.privateKey));
  return client;
}

export function buildToolkit(client: Client): HederaLangchainToolkit {
  return new HederaLangchainToolkit({
    client,
    configuration: {
      // Only load the plugins we need — no allCorePlugins to respect token budgets
      plugins: [coreConsensusPlugin, mppxHederaPlugin],
      context: {
        mode: AgentMode.AUTONOMOUS,
        // The mppx plugin reads privateKey directly from context for viem signing
        privateKey: env.privateKey,
        network: env.network,
        accountId: env.accountId,
      } as any,
    },
  });
}
