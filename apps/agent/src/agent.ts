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
    PrivateKey.fromStringECDSA(privateKey)
  );

  const countRecipients = (transfers: any[]) => {
    return transfers.filter((t: any) => {
      if (!t || !('amount' in t)) return true;
      const amt = t.amount;
      if (amt && typeof amt === 'object') {
        const bn = typeof amt.toBigNumber === 'function' ? amt.toBigNumber() : amt;
        return typeof bn.isGreaterThan === 'function' ? bn.isGreaterThan(0) : Number(amt) > 0;
      }
      return Number(amt) > 0;
    }).length;
  };

  const recipientLimit = new MaxRecipientsPolicy(
    1,
    ['transfer_hbar_tool', 'airdrop_fungible_token_tool'],
    {
      'transfer_hbar_tool': (params: any) => {
        console.log('[DIAG] MaxRecipientsPolicy: transfer_hbar_tool called with params:', JSON.stringify(params, null, 2));
        const transfers = params.hbarTransfers ?? [];
        console.log('[DIAG] MaxRecipientsPolicy: hbarTransfers array:', transfers);
        const count = countRecipients(transfers) || 1;
        console.log('[DIAG] MaxRecipientsPolicy: recipient count =', count, 'limit = 1');
        return count;
      },
      'airdrop_fungible_token_tool': (params: any) => {
        console.log('[DIAG] MaxRecipientsPolicy: airdrop_fungible_token_tool called with params:', JSON.stringify(params, null, 2));
        const transfers = params.tokenTransfers ?? [];
        console.log('[DIAG] MaxRecipientsPolicy: tokenTransfers array:', transfers);
        const count = countRecipients(transfers) || 1;
        console.log('[DIAG] MaxRecipientsPolicy: recipient count =', count, 'limit = 1');
        return count;
      },
    }
  );

  const safetyPolicy = new RejectToolPolicy([
    'create_topic_tool',
    //'submit_topic_message_tool',
    'delete_account_tool',
  ]);

  // Override to add logging
  const originalShouldBlock = (recipientLimit as any).shouldBlockPostParamsNormalization.bind(recipientLimit);
  (recipientLimit as any).shouldBlockPostParamsNormalization = function(params: any, method: string) {
    console.log('[DIAG] MaxRecipientsPolicy.shouldBlockPostParamsNormalization called for method:', method);
    console.log('[DIAG] MaxRecipientsPolicy relevantTools:', (recipientLimit as any).relevantTools);
    console.log('[DIAG] MaxRecipientsPolicy method matches?', (recipientLimit as any).relevantTools.includes(method));
    const result = originalShouldBlock(params, method);
    console.log('[DIAG] MaxRecipientsPolicy.shouldBlockPostParamsNormalization returning:', result);
    return result;
  };

  const auditTrailHook = new HcsAuditTrailHook(
    [
      'transfer_hbar_tool',
      'airdrop_fungible_token_tool',
      'mppx_hedera_charge_fetch_tool',
    ],
    process.env.HCS_TOPIC_ID!
  );

  const toolkitConfig = {
    client,
    configuration: {
      plugins: [...allCorePlugins, mppxHederaPlugin],
      context: {
        mode: AgentMode.AUTONOMOUS,
        accountId,
        privateKey,
        hooks: [recipientLimit, safetyPolicy, auditTrailHook],
      },
    },
  };

  console.log("[DIAG] config.context keys:", Object.keys(toolkitConfig.configuration.context));
  console.log("[DIAG] config.context.hooks length:", toolkitConfig.configuration.context.hooks?.length);
  console.log("[DIAG] recipientLimit relevantTools:", (recipientLimit as any).relevantTools);
  console.log("[DIAG] safetyPolicy relevantTools:", (safetyPolicy as any).relevantTools);
  console.log("[DIAG] auditTrailHook relevantTools:", (auditTrailHook as any).relevantTools);

  return new HederaLangchainToolkit(toolkitConfig);
}