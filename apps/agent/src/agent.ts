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

  // Counts positive-value transfers (recipients), excludes the sender (negative)
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

  // Blocks transfers exceeding 5 recipients (for easy test)
  const recipientLimit = new MaxRecipientsPolicy(
    5,
    ['transfer_hbar_tool', 'airdrop_fungible_token_tool'],
    {
      'transfer_hbar_tool': (params: any) => {
        const transfers = params.hbarTransfers ?? [];
        const count = countRecipients(transfers) || 1;
        return count;
      },
      'airdrop_fungible_token_tool': (params: any) => {
        const transfers = params.tokenTransfers ?? [];
        const count = countRecipients(transfers) || 1;
        return count;
      },
    }
  );

  // Blocks dangerous tools the LLM should never use
  const safetyPolicy = new RejectToolPolicy([
    'create_topic_tool',
    'delete_account_tool',
  ]);

  // Logs all payroll-related tool executions to the HCS audit topic
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

  return new HederaLangchainToolkit(toolkitConfig);
}
