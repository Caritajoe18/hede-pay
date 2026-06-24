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

  // 1. Initialize MaxRecipientsPolicy: Limits transfers to 5 recipients at once [4, 5]
  const recipientLimit = new MaxRecipientsPolicy(50);

  // 2. Initialize RejectToolPolicy: Explicitly blocks high-risk tools [4, 6]
  const safetyPolicy = new RejectToolPolicy([
    'delete_account',
    'freeze_token',
    'delete_topic'
  ]);
  const auditTrailHook = new HcsAuditTrailHook(
    [
      'transfer_hbar',
      'airdrop_fungible_token',
      'mppx_hedera_charge_fetch_tool' // You can audit 3rd party tools too!
    ],
    // The HCS Topic ID where logs will be sent
    process.env.HCS_TOPIC_ID!,
  );


  return new HederaLangchainToolkit({
    client,
    configuration: {
      //plugins: [coreAccountPlugin, coreTokenPlugin, coreAccountQueryPlugin, coreConsensusPlugin, mppxHederaPlugin],
      plugins: [...allCorePlugins, mppxHederaPlugin],
      tools: [],

      policies: [recipientLimit, safetyPolicy],  // Step 4 Guardrail
      hooks: [auditTrailHook],      // Step 5 Transparency
      context: {
        mode: AgentMode.AUTONOMOUS, // Mandatory for MPP and automated payroll [5]
        accountId: accountId,
        privateKey: privateKey
      },
    } as any,
  });
}