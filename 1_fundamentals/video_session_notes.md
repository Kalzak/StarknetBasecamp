## Why Cairo?

You can have some other entity execute your code for you, and you receive a result and proof.
If the execution has been intentiorally or unintentionally modified then the proof will be invalid.
This allows a regular computer to keep a super computer honest.
In other words, some other entity can do some massive computation, and it only takes a small amount of computation to verify correctness.
The proof verification cat detect cheating or malfunctioning without re-execution.

---

## Why StarkNet?

In Ethereum a block producer calculates a new state, but heaps of validators will also complete that execution to attest that it's correct.
This is inefficient in a way because the same thing is executed many times.
With StarkNet, you only need to execute one, then have a result and proof.
Then you just verify, so the computation by the validations is much smaller.

---

## Validity Proofs

Validity proofs are an implementation of Zero Knowledge Proofs (ZK Proofs).
It uses ZK proofs to guarantee computational integrity.
It's not used for privacy, it's for scaling.
ZK-Rollup is a misnomer, StarkNet is a validity rollup.
The type of ZK proofs that StarkNet uses is STARKs, not SNARKs.

But why use STARKs over SNARKs?

||STARK|SNARK|
|-|-|-|
|Verification|log2(n)|constant|
|Proof Size|~400KB|288 bytes|
|Trusted Setup|No|Yes|
|Quantum Secure|Yes|No|

Although SNARKs have a much smaller proof size and have a constant verification cost there are some other important points.
SNARKs require a trusted setup, so if that trusted setup is somehow leaked then the whole system is compromised.
STARKs don't require a trusted setup, so it's one less trust assumption.
STARKs are quantum secure, so when quantum computers emerge they cannot be broken by STARK.
So the proof size is a compromise but it's the best choice when considering the future.

---

## Why CairoVM and not EVM?

ZK-EVMs try to have maximum compatibility with Ethereum but that makes some sacrifices (efficiency, because it's not easy with ZK-circuits).

---

## Trustless cooperation limits

If you trust the verifier that verified the computation then you're fine.
But what if we want more trustlessness and don't want to trust the verifier?
For you to trust, the Cairo program needs to be publicly accessible and you need to be able to independently verify the proof.

---

## StarkNet's architecture

In StarkNet when you send a transaction, it first goes to the sequencer.
The CairoVM and the StarkNet OS lives in the sequencer.
The sequences takes all transactions and validate them, bundle them into blocks and calculate the new state of the network.
The sequencer creates an execution trace which is sent to the prover, which will compute a validity proof to attest to the integrity of the execution.
This validity proof is then sent to L1 as calldata to a verifier smart contract.
The verifier smart contract will verify the proof
If the verification is successful, then the sequencer will change the state, and publish that state change to another L1 contract.
That contract is the "StarkNet Core", which tracks the state of StarkNet.

Quick summary:
**Sequencer**: Validates, executes and bundles txs into blocks.
**Prover**: Creates STARK proofs for StarkNet and StarkEx (SHARP)
**Verifier**: L1 smart contract that verifies STARK proofs from SHARP
**StarkNet Core**: L1 smart contract that stores changes to L2 global state (Data availiability)

---

## Cairo1 Characteristics

Heavily inspired by Rust, so it's strongly typed.
It doesn't directyl compile to Cairo bytecode (CASM), it compiles to Sierra.
Sierra is **S**afe **I**nt**e**rmediate **R**rep**r**esentation.
Even if a program fails a proof is generated.

---

## Regenesis: Closing the gap

In Cairo0, failed transaction could not be proven.
This would open the door for DOS attacks on the sequencer because it would do computation and then eventually fail and then not go onto the block.
Cairo1 fixes this problem, but it means that eventually Cairo0 contracts will have to be disabled on the network for security reasons.
There will be an event called "Regenesis" where only Cairo1 contract will be able to be executed. This has not happened yet.

---

## Tools

For wallets you have ArgentX and Braavos
For block explorers you have Voyager and StarkScan
For smart contract development you have Protostar and OpenZeppelin contract wizard
Other tools:
- starknet-devnet: Ganache but StarkNet
- starknet.py: Python SDK
