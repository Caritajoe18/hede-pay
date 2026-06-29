onal.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      '\n' +
      'If multiple recipients are specified, the tool will create a single transaction for all transfers - they should be defined in recipients array.\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'transfer_non_fungible_token_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      "This tool will transfer HTS non-fungible tokens (NFTs) from the operator's account to specified recipients.\n" +
      '\n' +
      'Parameters:\n' +
      '- tokenId (string, required): The NFT token ID to transfer (e.g. "0.0.12345")\n' +
      '- recipients (array, required): List of objects specifying recipients and serial numbers - accepts multiple transfers at once\n' +
      '  - recipientId (string, required): Account to transfer to\n' +
      '  - serialNumber (number, required): NFT serial number to transfer\n' +
      '- transactionMemo (string, optional): Optional memo for the transaction\n' +
      'schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      'If multiple recipients are specified, the tool will create a single transaction for all transfers - they should be defined in recipients array.\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'transfer_fungible_token_with_allowance_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will transfer a HTS fungible token using an existing **token allowance**.\n' +
      '\n' +
      'Parameters:\n' +
      '- tokenId (string, required): The token ID to transfer (e.g. "0.0.12345")\n' +
      '- sourceAccountId (string, required): Account ID of the token owner (the allowance granter)\n' +
      '- transfers (array of objects, required): List of token transfers. Each object should contain:\n' +
      '  - accountId (string, required): Recipient account ID\n' +
      '  - amount (number, required): Amount of tokens to transfer in display unit\n' +
      '- transactionMemo (string, optional): Optional memo for the transaction\n' +
      'schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      '\n' +
      'Example: Spend allowance from account 0.0.1002 to send 25 fungible tokens with id 0.0.33333 to 0.0.2002\n' +
      "Example 2: Use allowance from 0.0.1002 to send 50 TKN (FT token id: '0.0.33333') to 0.0.2002 and 75 TKN to 0.0.3003\n",
    class: 'HederaAgentKitTool'
  },
  {
    name: 'create_topic_tool',
    description: '\n' +
      'This tool will create a new topic (consensus topic) on the Hedera network (HCS). Use this for any request to: create a topic, open a consensus topic, or start a new communication channel.\n' +
      'All parameters are optional!\n' +
      '\n' +
      'Parameters:\n' +
      '- topicMemo (str, optional): A memo stored permanently on the topic itself (not the transaction). It is not required to set a topic memo!\n' +
      '- transactionMemo (str, optional): A memo attached to the transaction (separate from topicMemo). Use this when the user says "transaction memo" or "set the memo on the transaction"\n' +
      "- adminKey (bool or str, optional): Admin key for the topic. ONLY set this if the user wants to be able to UPDATE or DELETE the topic later. Pass boolean value 'true' to use operator key, or string value public key.\n" +
      `- submitKey (bool or str, optional): Submit key for the topic. ONLY set this if the user explicitly says they want to RESTRICT who can submit messages (e.g. "restrict submit access", "require a key to submit"). If the user says "do NOT restrict", "open access", "anyone can submit", or simply omits it — do NOT set this parameter at all, leave it undefined. Pass boolean value 'true' to use operator key, or string value public key.\n` +
      'schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'submit_topic_message_tool',
    description: '\n' +
      'This tool will submit a message to a topic on the Hedera network.\n' +
      '\n' +
      'Parameters:\n' +
      '- topicId (str, required): The ID of the topic to submit the message to\n' +
      '- message (str, required): The message to submit to the topic\n' +
      '- transactionMemo (str, optional): An optional memo to include on the transaction\n' +
      'schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'delete_topic_tool',
    description: '\n' +
      'This tool will delete a given Hedera network topic.\n' +
      '\n' +
      'Parameters:\n' +
      '- topicId (str, required): id of topic to delete\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'update_topic_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      'This tool will update an existing Hedera Consensus Topic. Only the fields provided will be updated.\n' +
      'Key fields (adminKey, submitKey) must contain **Hedera-compatible public keys (as strings) or boolean (true/false)**. You can provide these in one of three ways:\n' +
      '1. **Boolean true** – Set this field to use user/operator key. Injecting of the key will be handled automatically.\n' +
      '2. **Not provided** – The field will not be updated.\n' +
      '3. **String** – Provide a Hedera-compatible public key string to set a field explicitly.\n' +
      '\n' +
      'Parameters:\n' +
      '- topicId (str, optional): The Hedera account ID or EVM address. If not provided, defaults to the operator account\n' +
      '- topicMemo (string, optional): New memo for the topic.\n' +
      '- adminKey (boolean|string, optional): New admin key. Pass true to use your operator key, or provide a public key string.\n' +
      '- submitKey (boolean|string, optional): New submit key. Pass true to use your operator key, or provide a public key string.\n' +
      '- autoRenewAccountId (string, optional): Account to automatically pay for renewal.\n' +
      '- autoRenewPeriod (number, optional): Auto renew period in seconds.\n' +
      '- expirationTime (string|Date, optional): New expiration time for the topic (ISO string or Date).\n' +
      'Examples:\n' +
      '- If the user asks for "my key" → set the field to `true`.\n' +
      '- If the user does not mention the key → do not set the field.\n' +
      '- If the user provides a key → set the field to the provided public key string.\n' +
      '\n' +
      'If the user provides multiple fields in a single request, \n' +
      'combine them into **one tool call** with all parameters together.\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'create_erc20_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool creates an ERC20 token on Hedera by calling the BaseERC20Factory contract. ERC20 is an EVM compatible fungible token.\n' +
      '\n' +
      'Parameters:\n' +
      '- tokenName (str, required): The name of the token\n' +
      '- tokenSymbol (str, required): The symbol of the token\n' +
      '- decimals (int, optional): The number of decimals the token supports. Defaults to 18\n' +
      '- initialSupply (int, optional): The initial supply of the token. Defaults to 0\n' +
      '- schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'transfer_erc20_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will transfer a given amount of an existing ERC20 token on Hedera. ERC20 is an EVM compatible fungible token.\n' +
      '\n' +
      'Parameters:\n' +
      '- contractId (str, required): The id of the ERC20 contract. This can be the EVM address or the Hedera account id.\n' +
      '- recipientAddress (str, required): The EVM or Hedera address to which the tokens will be transferred. This can be the EVM address or the Hedera account id.\n' +
      '- amount (number, required): The amount to be transferred\n' +
      '- schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      '\n' +
      'Example: "Transfer 1 ERC20 token 0.0.6473135 to 0xd94dc7f82f103757f715514e4a37186be6e4580b" means transferring the amount of 1 of the ERC20 token with contract id 0.0.6473135 to the 0xd94dc7f82f103757f715514e4a37186be6e4580b EVM address.\n' +
      'Example: "Transfer 1 ERC20 token 0xd94dc7f82f103757f715514e4a37186be6e4580b to 0.0.6473135" means transferring the amount of 1 of the ERC20 token with contract id 0xd94dc7f82f103757f715514e4a37186be6e4580b to the 0.0.6473135 Hedera account id.\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'transfer_erc721_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will transfer an existing ERC721 token on Hedera. ERC721 is an EVM compatible non fungible token (NFT).\n' +
      '\n' +
      'Parameters:\n' +
      '- contractId (str, required): The id of the ERC721 contract\n' +
      '- fromAddress (str, optional): The Hedera account ID or EVM address. If not provided, defaults to the operator account\n' +
      '- toAddress (str, required): The address to which the token will be transferred. This can be the EVM address or the Hedera account id.\n' +
      '- tokenId (number, required): The ID of the transferred token\n' +
      'schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      '\n' +
      'Example:\n' +
      '"Transfer ERC721 token 0.0.6486793 with id 0 from 0xd94...580b to 0.0.6486793" transfers token ID 0 from the given EVM address to the given Hedera account.\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'mint_erc721_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will mint (create a new token from existing contract) a new ERC721 token on Hedera. ERC721 is an EVM compatible non fungible token (NFT).\n' +
      'Use this only for EVM contract-based ERC721 minting.\n' +
      'Do NOT use this tool for HTS NFT mint requests that provide metadata URI/URIs for a Hedera token class (those belong to mint_non_fungible_token_tool).\n' +
      '\n' +
      'Parameters:\n' +
      '- contractId (str, required): The id of the ERC721 contract\n' +
      '- toAddress (str, optional): The Hedera account ID or EVM address. If not provided, defaults to the operator account\n' +
      'schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      '\n' +
      'Example: "Mint ERC721 token 0.0.6486793 to 0xd94dc7f82f103757f715514e4a37186be6e4580b" means minting the ERC721 token with contract id 0.0.6486793 to the 0xd94dc7f82f103757f715514e4a37186be6e4580b EVM address.\n' +
      'Example: "Mint ERC721 token 0.0.6486793 to 0.0.6486793" means minting the ERC721 token with contract id 0.0.6486793 to the 0.0.6486793 Hedera account id.\n' +
      '\n' +
      "NOTE: the 'toAddress' parameter is optional. If not provided, the minting will be performed to the default account as per the context.\n",
    class: 'HederaAgentKitTool'
  },
  {
    name: 'create_erc721_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool creates an ERC721 token on Hedera by calling the BaseERC721Factory contract. ERC721 is an EVM compatible non fungible token (NFT).\n' +
      '\n' +
      'Parameters:\n' +
      '- tokenName (str, required): The name of the token\n' +
      '- tokenSymbol (str, required): The symbol of the token\n' +
      '- baseURI (str, required): The base URI for token metadata\n' +
      'schedulingParams (object, optional): Parameters for scheduling this transaction instead of executing immediately. \n' +
      '\n' +
      '**Fields that apply to the *schedule entity*, not the inner transaction:**\n' +
      '\n' +
      '- **isScheduled** (boolean, optional, default false):  \n' +
      '  If true, the transaction will be created as a scheduled transaction.  \n' +
      '  If false or omitted, all other scheduling parameters will be ignored.\n' +
      '\n' +
      '- **adminKey** (boolean|string, optional, default false):  \n' +
      '  Admin key that can delete or modify the scheduled transaction before execution.  \n' +
      '  - If true, the operator key will be used.  \n' +
      '  - If false or omitted, no admin key is set.  \n' +
      '  - If a string is passed, it will be used as the admin key.\n' +
      '\n' +
      '- **payerAccountId** (string, optional):  \n' +
      '  Account that will pay the transaction fee when the scheduled transaction executes.  \n' +
      '  Defaults to the operator account.\n' +
      '\n' +
      '- **expirationTime** (string, optional, ISO 8601):  \n' +
      '  Time when the scheduled transaction will expire if not fully signed.\n' +
      '  \n' +
      '- **waitForExpiry** (boolean, optional, default `false`):  \n' +
      '  Determines when the scheduled transaction executes:  \n' +
      '  - `false` (default): execute as soon as all required signatures are collected.  \n' +
      '  - `true`: execute at the scheduled expiration time, even if all signatures are already collected.  \n' +
      '  Requires `expirationTime` to be set if `true`. Set to `true` only when the user explicitly requests execution at expiration.\n' +
      '\n' +
      '**Notes**\n' +
      '- Setting any scheduling parameter implies delayed execution through the Hedera schedule service.\n' +
      '- The network executes the scheduled transaction automatically once all required signatures are collected.\n' +
      '\n' +
      '\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      'The contractId returned by the tool is the address of the ERC721 Factory contract, the address of the ERC721 token is the erc721Address returned by the tool.\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_hbar_balance_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the HBAR balance for a given Hedera account.\n' +
      '\n' +
      'Parameters:\n' +
      '- accountId (str, optional): The Hedera account ID. If not provided, defaults to the operator account\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_account_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the account information for a given Hedera account. The returned account will contain the balance in HBAR, public key, and EVM address.\n' +
      '\n' +
      'Parameters:\n' +
      '- accountId (str, required): The account ID to query\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_account_token_balances_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the token balances for a given Hedera account. The human message will contain parsed balances in display units whereas the extra field will contain the raw token balances response from the mirror node with .\n' +
      '\n' +
      'Parameters:\n' +
      '- accountId (str, optional): The Hedera account ID. If not provided, defaults to the operator account\n' +
      '- tokenId (str, optional): The token ID to query for. If not provided, all token balances will be returned\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_token_info_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the information for a given Hedera token. Make sure to return token symbol.\n' +
      '\n' +
      'Parameters:\n' +
      '- tokenId (str): The token ID to query for.\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_pending_airdrop_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return pending airdrops for a given Hedera account.\n' +
      '\n' +
      'Parameters:\n' +
      '- accountId (str, optional): The Hedera account ID. If not provided, defaults to the operator account\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_topic_messages_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the messages for a given Hedera topic.\n' +
      '\n' +
      'Parameters:\n' +
      '- topicId (str, required): The topic ID to query\n' +
      '- startTime (datetime, optional): The start datetime to query. If set, the messages will be returned after this datetime\n' +
      '- endTime (datetime, optional): The end datetime to query. If set, the messages will be returned before this datetime\n' +
      '- limit (int, optional): The limit of messages to query. If set, the number of messages to return\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_topic_info_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the information for a given Hedera topic (HCS).\n' +
      '\n' +
      'Parameters:\n' +
      '- topicId (str): The topic ID to query for.\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_contract_info_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the information for a given Hedera contract.\n' +
      '\n' +
      'Parameters:\n' +
      '- contractId (str): The contract ID to query for.\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_exchange_rate_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool returns the Hedera network HBAR exchange rate from the Mirror Node.\n' +
      '\n' +
      'Parameters:\n' +
      '- timestamp (str, optional): Historical timestamp to query. Pass seconds or nanos since epoch (e.g., 1726000000.123456789). If omitted, returns the latest rate.\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'get_transaction_record_query_tool',
    description: '\n' +
      'Context:\n' +
      '- Mode: Autonomous (agent executes transactions directly)\n' +
      '- User Account: 0.0.6753424\n' +
      '- When no account is specified, the operator account will be used\n' +
      '\n' +
      'This tool will return the transaction record for a given Hedera transaction ID.\n' +
      '\n' +
      'Parameters:\n' +
      '- transactionId (str, required): The transaction ID to fetch record for. Should be in format \\"shard.realm.num-sss-nnn\\" format where sss are seconds and nnn are nanoseconds\n' +
      '- nonce (number, optional): Optional nonce value for the transaction\n' +
      '\n' +
      'Important:\n' +
      '- Do not request or ask for parameters that are optional and were not provided by the user. Tool can be called without any parameters if all are optional.\n' +
      '- Only include optional parameters if explicitly provided by the user\n' +
      '- Do not generate placeholder values for optional fields\n' +
      '- Leave optional parameters undefined if not specified by the user\n' +
      '- If a required parameter is not specified by the user, DO NOT guess or generate placeholder values. You must stop and ask the user for the missing required information.\n' +
      '- If the user says "schedule", "scheduled", or clearly asks to schedule execution, set schedulingParams.isScheduled to true.\n' +
      "- Important: If the user mentions multiple recipients or amounts and tool accepts an array, combine all recipients, tokens or similar assets into a single array and make exactly one call to that tool. Do not split the action into multiple tool calls if it's possible to do so.\n" +
      '\n' +
      '\n' +
      'Additional information:\n' +
      'If user provides transaction ID in format 0.0.4177806@1755169980.051721264, parse it to 0.0.4177806-1755169980-051721264 and use it as transaction ID. Do not remove the staring zeros.\n',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'mppx_hedera_charge_fetch_tool',
    description: 'Call a 402-protected API endpoint and automatically pay with USDC on Hedera.\n' +
      '\n' +
      'The tool:\n' +
      '1. Sends an HTTP request to the URL\n' +
      '2. If the server returns 402 (Payment Required), parses the MPP challenge\n' +
      '3. Pays the requested amount in USDC via a native Hedera transaction\n' +
      '4. Retries the request with the payment credential\n' +
      '5. Returns the response data\n' +
      '\n' +
      'Parameters:\n' +
      '- url: The URL of the API endpoint\n' +
      '- method: HTTP method (GET or POST), defaults to GET\n' +
      '- body: Optional request body for POST requests\n' +
      '- maxAmount: Maximum USDC to pay in base units (6 decimals). Default 100000 = $0.10',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'mppx_hedera_session_open_tool',
    description: 'Open a payment channel (session) with a 402-protected API server.\n' +
      '\n' +
      'Deposits USDC into an on-chain escrow contract. After opening, use mppx_hedera_session_fetch_tool\n' +
      'to make fast, off-chain payments (sub-millisecond per call, no gas). When done, use\n' +
      'mppx_hedera_session_close_tool to settle and recover unused funds.\n' +
      '\n' +
      'Parameters:\n' +
      '- url: The base URL of the API server that supports MPP session payments\n' +
      '- deposit: USDC amount to deposit (human-readable, e.g. "0.10" for 10 cents)',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'mppx_hedera_session_fetch_tool',
    description: 'Fetch data from a server using an existing MPP payment session.\n' +
      '\n' +
      'This is the fast path — each call signs an off-chain EIP-712 voucher (sub-millisecond, no gas cost).\n' +
      'A session must be opened first with mppx_hedera_session_open_tool.\n' +
      '\n' +
      'Parameters:\n' +
      '- url: The URL to fetch (must be on the same server where a session is open)\n' +
      '- method: HTTP method (GET or POST), defaults to GET\n' +
      '- body: Optional request body for POST requests',
    class: 'HederaAgentKitTool'
  },
  {
    name: 'mppx_hedera_session_close_tool',
    description: 'Close a payment session and settle on-chain.\n' +
      '\n' +
      'The server settles the escrow contract — the payee receives the earned amount and the\n' +
      'payer gets a refund for any unused deposit. After closing, the session is removed.\n' +
      '\n' +
      'Parameters:\n' +
      '- url: The URL of the server whose session to close',
    class: 'HederaAgentKitTool'
  }
]
HedePay 