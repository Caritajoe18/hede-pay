import { Client, PrivateKey } from '@hiero-ledger/sdk';
import { AgentMode } from '@hashgraph/hedera-agent-kit';
import { HederaLangchainToolkit } from '@hashgraph/hedera-agent-kit-langchain';
import { HcsAuditTrailHook } from '@hashgraph/hedera-agent-kit/hooks';
import { MaxRecipientsPolicy } from '@hashgraph/hedera-agent-kit/policies';
import { allCorePlugins } from '@hashgraph/hedera-agent-kit/plugins';
import * as dotenv from 'dotenv';

dotenv.config();

async function testCoreHooks() {
  console.log('[TEST] Testing hooks with HederaAgentKit API (bypassing LangChain agent)');

  const client = Client.forTestnet().setOperator(
    process.env.ACCOUNT_ID!,
    PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY!)
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
    ['transfer_hbar_tool'],
    {
      'transfer_hbar_tool': (params: any) => {
        console.log('[TEST CORE] MaxRecipientsPolicy: transfer_hbar_tool called with params:', JSON.stringify(params, null, 2));
        const transfers = params.hbarTransfers ?? [];
        console.log('[TEST CORE] MaxRecipientsPolicy: hbarTransfers array:', transfers);
        const count = countRecipients(transfers) || 1;
        console.log('[TEST CORE] MaxRecipientsPolicy: recipient count =', count, 'limit = 1');
        return count;
      },
    }
  );

  const auditHook = new HcsAuditTrailHook(
    ['transfer_hbar_tool'],
    process.env.HCS_TOPIC_ID!
  );

  // Override to add logging
  const originalShouldBlock = (recipientLimit as any).shouldBlockPostParamsNormalization.bind(recipientLimit);
  (recipientLimit as any).shouldBlockPostParamsNormalization = function(params: any, method: string) {
    console.log('[TEST CORE] MaxRecipientsPolicy.shouldBlockPostParamsNormalization called for method:', method);
    console.log('[TEST CORE] MaxRecipientsPolicy relevantTools:', (recipientLimit as any).relevantTools);
    console.log('[TEST CORE] MaxRecipientsPolicy method matches?', (recipientLimit as any).relevantTools.includes(method));
    const result = originalShouldBlock(params, method);
    console.log('[TEST CORE] MaxRecipientsPolicy.shouldBlockPostParamsNormalization returning:', result);
    return result;
  };

  const toolkit = new HederaLangchainToolkit({
    client,
    configuration: {
      plugins: allCorePlugins,
      context: {
        mode: AgentMode.AUTONOMOUS,
        accountId: process.env.ACCOUNT_ID!,
        hooks: [recipientLimit, auditHook],
      },
    },
  });

  const api = toolkit.getHederaAgentKitAPI();

  console.log('[TEST CORE] API initialized');
  console.log('[TEST CORE] context.hooks length:', (api as any).context?.hooks?.length);
  console.log('[TEST CORE] recipientLimit relevantTools:', (recipientLimit as any).relevantTools);

  try {
    console.log('[TEST CORE] Attempting transfer to 2 recipients (should be blocked)...');
    const result = await api.run('transfer_hbar_tool', {
      hbarTransfers: [
        { to: '0.0.6812613', amount: 1 },
        { to: '0.0.9282029', amount: 1 },
      ],
    });
    console.log('[TEST CORE] Transfer succeeded (UNEXPECTED - should have been blocked):', result);
  } catch (error: any) {
    console.log('[TEST CORE] Transfer blocked as expected:', error.message);
  }

  try {
    console.log('[TEST CORE] Attempting transfer to 1 recipient (should succeed)...');
    const result = await api.run('transfer_hbar_tool', {
      hbarTransfers: [
        { to: '0.0.6812613', amount: 1 },
      ],
    });
    console.log('[TEST CORE] Transfer succeeded as expected:', result);
  } catch (error: any) {
    console.log('[TEST CORE] Transfer failed (UNEXPECTED):', error.message);
  }
}

testCoreHooks().catch(console.error);
