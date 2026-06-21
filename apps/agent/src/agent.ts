import { Client, PrivateKey } from '@hiero-ledger/sdk';
import { AgentMode } from '@hashgraph/hedera-agent-kit';
import { HederaLangchainToolkit } from '@hashgraph/hedera-agent-kit-langchain';
import {
  coreAccountPlugin,
  coreConsensusPluginToolNames,
  coreTokenPlugin,
  coreConsensusPlugin,
  coreAccountQueryPlugin,
  coreAccountQueryPluginToolNames,
  coreTokenPluginToolNames
} from '@hashgraph/hedera-agent-kit/plugins';
import { mppxHederaPlugin } from 'hak-mppx-hedera-plugin';

export class PayrollSpendLimitPolicy {
  private limit: number;

  constructor(limit: number) {
    this.limit = limit;
  }

  async onAfterParameterNormalization(tool: any, params: any) {
    const targetedTools = [
      'AIRDROP_FUNGIBLE_TOKEN_TOOL',
      'TRANSFER_FUNGIBLE_TOKEN_WITH_ALLOWANCE_TOOL'
    ];

    if (targetedTools.includes(tool.name)) {
      const amount = Number(params.amount || 0);

      if (amount > this.limit) {
        throw new Error(
          `Guardrail Violation: Requested transfer of ${amount} exceeds the limit of ${this.limit} USDC.`
        );
      }
    }
    return { success: true };
  }
}

export class HedePayAuditHook {
  private topicId: string;

  constructor(topicId: string) {
    this.topicId = topicId;
  }

  async onAfterToolExecution(tool: any, result: any) {
    // We only log successful on-chain transactions
    if (result && result.transactionId) {
      const logMessage = JSON.stringify({
        agent: "HedePay-MVP",
        action: tool.name,
        status: "SUCCESS",
        txId: result.transactionId,
        timestamp: new Date().toISOString()
      });

      // Note: In a production environment, you would call the 
      // SUBMIT_TOPIC_MESSAGE_TOOL here via the agent instance [8].
      console.log(`[HCS Audit Log]: ${logMessage}`);
    }
  }
}



export function buildToolkit(accountId: string, privateKey: string) {
  const client = Client.forTestnet().setOperator(
    accountId,
    PrivateKey.fromStringECDSA(privateKey)
  );

  const spendLimit = new PayrollSpendLimitPolicy(1000);
  const auditLog = new HedePayAuditHook(process.env.HCS_TOPIC_ID!);

  return new HederaLangchainToolkit({
    client,
    configuration: {
      plugins: [coreAccountPlugin, coreTokenPlugin, coreAccountQueryPlugin, coreConsensusPlugin, mppxHederaPlugin],
      tools: [
        // Use property access instead of string literals
        coreTokenPluginToolNames.AIRDROP_FUNGIBLE_TOKEN_TOOL,
        coreTokenPluginToolNames.ASSOCIATE_TOKEN_TOOL,
        coreConsensusPluginToolNames.SUBMIT_TOPIC_MESSAGE_TOOL,
        "mppx_hedera_charge_fetch_tool",
        coreAccountQueryPluginToolNames.GET_HBAR_BALANCE_QUERY_TOOL,

        //Commented out to ensure the agent does not create additional topics.
        //coreConsensusPluginToolNames.CREATE_TOPIC_TOOL,       
      ],

      policies: [spendLimit], // Step 4 Guardrail
      hooks: [auditLog],      // Step 5 Transparency
      context: {
        mode: AgentMode.AUTONOMOUS, // Mandatory for MPP and automated payroll [5]
        accountId: accountId,
        privateKey: privateKey
      },
    } as any,
  });
}