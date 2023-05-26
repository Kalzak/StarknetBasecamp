# Session 2: Deep dive

---

## Section1: Smart wallets (aka account abstraction)

On L1 (Ethereum) only an EOA can start a TX. EOAs are supported at the protocol level. 
There are some limitations to them though:
- Dumb:
  - One know how to sign txs
  - Only one elliptic curve supported
- Bad UX:
  - Seed phase management
  - Lose access to PK and you're ruined
  - PK compromise and you're ruined
- Expensive
  - Hardware wallet costs
  - One action at a time, if you want to do three things, you need three txs

You have multisigs on L1 too
- But you can't start on sign txs
- It's a contract, so it lives at the application layer not the protocol layer

Here come EIP-4337 (account abstraction)
- Goal:
  - To make smart contract wallets first class citizens
- Benefits: 
  - Customized signature verification
  - Transaction bundle (multicall)
  - Paying fees with non-native tokens
  - Payment delegation (paymaster)

### Account abstraction differences on ETH vs SN

Integration:
- Ethereum is on application layer
- Starknet is on protocol layer

Ecosystem support:
- Ethereum not really sure how good support is
- Starknet has full support (cause native)

Custom signatures:
- Both supported

Fee delegation:
- Ethereum has a paymaster smart contract
- Starknet has meta transactions (?, hopefully learn this)

### Bundling user operations

If you want to do multiple steps (approve then transfer) they're not normally guaranteed to be right after one another.
Here are the possibilities:
- There is a TX inbetween
- There is a block inbetween
- Both of these allow for MEV moments

On starknet you can have a multicall where you have only one transaction, and it loops through them all in your smart contract wallet

### Signer vs user account

- The signer is the "wallet" and that basically just signs stuff to invoke txs
- Then you have your "user account contract" which is the smart contract
- Basically you sign and invoke the tx, then the "user account contact" will `validate` the tx and then `execute` it

### How the transaction flow looks

- The sequencer picks transactions to batch (it's basically trying to build a block)
- It'll continue to pick transactions 
- For each transaction that is picked it does the following
  - Validate the nonce (at starknet OS level)
    - if valid then continue
    - if not valid then just straight up reject
  - validate the tx (using smart contract `validate` func)
    - if valid then payment is done for fees
    - if not valid no fees and nothing really happens
  - execute the tx (using smart contrat `execute` func)
    - if successful exec than add tx to output batch
    - if failed exec then add tx to failure batch (they still pay fees)
  - then it goes back to sequencer, sees if needs to add any more txs to block, then just loop 
- When sequencer has enough for block, then send batch to SHARP

### Verifying signaturens

- You have the `__validate__` function which accepts an array of calls
- You don't have to actually read that data, but if you wanted to fail a validate on some particular call at least you can
- But then you reach the function `_validate_transaction` which gets the tx info, then hash and signature
- It then assertts that the signature is valid for he given tx hash,by using `_is_vaild_siganture` which can have signature validation
- You can use any signature verification that you like here
- Note that you can only read from your own storage during this process
- There is a limited number of CASM steps during this process to make sure you can't dos

### Executing transactions

- Calls the `__execute__` function which will go through the array content and run execute each call
- Pretty straightforward

### Counterfactual deployment

- With account abstraction, user accounts are smart contracts
- To deploy a smart contract you need to pay gas fees
- To pay gas fees you need a user account
- Seems like this is circular logic but can be solved
- You can calculate the address of your AA wallet contract
- Then you send funds to it, then you deploy and it takes fees of the tokens that were sent to that address

## Section2: Universal Deployer
There are three types of transactions on Starknet
- `deploy_account`: Deploys a user account (smart wallet)
- `declare`: Registers the sierra code of a smart contract on-chain
- `invoke`: Executes an "external" smart contract function

### Declaring vs deploying

- Basically declarations allow you to declare some code, a "contract class" which is defined by a "class hash"
- And each contract will point to a class hash
- So if you have 1000 contracts with same class hash, that code exists only one, and all point to it
- Rather than on EThereum where multiple contract instances each have their own separate code even if identical
- The clash is derived as follows:
  - Hash of: `hash(contract_class_version, externaly_entry_points, l1_handler_entry_points, constructor_entry_points, abi_hash, sierra_program_hash)`

When you want to deploy, you make a normal `invoke` call to a contract called the "Universal Deployer Contract".
That contract has the ability to use a special syscall `deploy` which you pass constuctor arguments and classhash etc. 
Then it'll deploy at some address for you
Here are the arguments that the deploy syscall takes:
- classhash
- salt
- unique (if true, the generate address is derived from deployer address, default to zero address if empty)
- then arguments for constructor

You can also use these classhashes for library calls (basically delegatecall in Ethereum)

## Section3: Starknet's SDKs

An SDK is a "software development kit". It allows you to interact with StarkNet programmatically (declare, invoke, call). 
Intearcts through the "Gateway" (?). 
Includes some CLI features, available in mulitple languages. StarknetJS is most popular

Here are some others:
- starknet-rs
- starknet.py
- starknet.jvm (java/kotlin/scala)
- starknet.swift (ios)


