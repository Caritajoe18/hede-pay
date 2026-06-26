import { Client, PrivateKey } from '@hiero-ledger/sdk';
import { AgentMode } from '@hashgraph/hedera-agent-kit';
import { HederaLangchainToolkit } from '@hashgraph/hedera-agent-kit-langchain';
import { HcsAuditTrailHook } from '@hashgraph/hedera-agent-kit/hooks';
import {
  MaxRecipientsPolicy,
  RejectToolPolicy
} from '@hashgraph/hedera-agent-kit/policies';

import { allCorePlugins } from '@hashgraph/hedera-agent-kit/plugins';
import { mppxHederaPlugin } from 'hak-mppx-hedera-plugin';

export function buildToolkit(accountId: string, privateKey: string) {
  const client = Client.forTestnet().setOperator(
    accountId,
    // Note: ECDSA is required for MPPX plugin support (Source 62)
    PrivateKey.fromStringECDSA(privateKey)
  );

  // 1. Robust MaxRecipientsPolicy Strategy
  // We use multiple keys (recipients, hbarTransfers, tokenTransfers) to ensure
  // the policy catches the count regardless of v3/v4 schema variations (Sources 154, 155).
  const recipientTools = [
    'transfer_hbar_tool', 'transfer_hbar',
    'airdrop_fungible_token_tool', 'airdrop_fungible_token'
  ];

  const recipientLimit = new MaxRecipientsPolicy(
    2,
    recipientTools,
    {
      'transfer_hbar_tool': (params) => {
        console.log('[DEBUG] Strategy triggered');
        return (params.recipients || params.hbarTransfers || []).length || 1;
      },
      'transfer_hbar': (params) => {
        console.log('[DEBUG] Shorthand strategy triggered');
        return (params.recipients || params.hbarTransfers || []).length || 1;
      }
    }
  );

  // 2. Hardened Safety Policies
  // Added 'create_topic_tool' and 'submit_topic_message_tool' to ensure the agent 
  const safetyPolicy = new RejectToolPolicy([
    'create_topic_tool', 'create_topic',
    'submit_topic_message_tool', 'submit_topic_message',
    'delete_account_tool', 'delete_account'
  ]);
  // 3. Initialize HcsAuditTrailHook
  // Topic must be pre-created and allow submissions from the operator (Sources 124, 201).
  const auditTrailHook = new HcsAuditTrailHook(
    [
      'transfer_hbar_tool',
      'transfer_hbar',
      'airdrop_fungible_token_tool',
      'airdrop_fungible_token',
      'mppx_hedera_charge_fetch_tool',
      'mppx_hedera_charge_fetch'
    ],
    process.env.HCS_TOPIC_ID!
  );

  // 4. Toolkit Configuration
  // CRITICAL: Hooks and policies MUST be registered in configuration.context.hooks 
  // for the BaseTool lifecycle to find them 00).
  const toolkitConfig = {
    client,
    configuration: {
      plugins: [...allCorePlugins, mppxHederaPlugin],
      policies: [recipientLimit, safetyPolicy],
      hooks: [auditTrailHook],
      context: {
        mode: AgentMode.AUTONOMOUS,
        accountId: accountId,
        privateKey: privateKey,
        // The individual tools look specifically at this array during Stage 1 and 3
        hooks: [recipientLimit, safetyPolicy, auditTrailHook],
      },
    },
  };

  return new HederaLangchainToolkit(toolkitConfig);
}