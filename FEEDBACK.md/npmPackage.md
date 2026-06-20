## Feedback to maintainers

I ran `npm audit fix` in the project and found vulnerabilities in the dependency graph.

### Issues found

1. `protobufjs`
   - Severity: high
   - Status: `No fix available`
   - Affected dependency chain:
     - `@hiero-ledger/proto`
     - `@hiero-ledger/sdk`
     - `@hashgraph/hedera-agent-kit`
     - `@hashgraph/hedera-agent-kit-langchain`
   - Reported advisories:
     - GHSA-66ff-xgx4-vchm
     - GHSA-2pr8-phx7-x9h3
     - GHSA-fx83-v9x8-x52w
     - GHSA-75px-5xx7-5xc7
     - GHSA-jvwf-75h9-cwgg
     - GHSA-685m-2w69-288q
     - GHSA-q6x5-8v7m-x3cv
     - GHSA-jggg-4jg4-v7c6

2. `uuid`
   - Severity: moderate
   - Fix available via `npm audit fix`
   - Transitive path:
     - `@hashgraph/hedera-agent-kit-langchain` → `@langchain/core` / `langchain`
   - Recommended minimum version: `>=11.1.1`
   - Current safe version available: `14.0.0`

3. `ws`
   - Severity: moderate
   - Fix available via `npm audit fix`
   - Transitive path:
     - `@hiero-ledger/sdk` → `ethers`
   - Recommended update: any fixed version newer than `8.20.0`

### Request

Please review and update the package dependencies so that:

- `protobufjs` is upgraded to a non-vulnerable version or replaced if required by your dependency chain.
- `uuid` is updated to at least `11.1.1`, ideally `14.0.0`.
- `ws` is updated to a fixed version newer than `8.20.0`.

If these vulnerabilities are caused by transitive dependencies, a dependency bump or patch release would help downstream users avoid this insecure audit state.

Thanks for maintaining the project 😊
