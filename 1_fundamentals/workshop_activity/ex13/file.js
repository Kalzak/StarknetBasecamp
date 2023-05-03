let starknet = require('starknet');

async function solve() {

    const provider = new starknet.Provider({
        sequencer: {
            network: 'goerli-alpha'
        }    
    })

    let user_slot_key = starknet.hash.starknetKeccak("user_slots");

    user_slot_key = starknet.hash.pedersen([user_slot_key, "0x00C255eD48A15564CDFe06C53DBd9cDdd694cd6E87390AfeC4802b81Cc9699aB"]);

    console.log(user_slot_key);

    let user_slot = await provider.getStorageAt("0x067ed1d23c5cc3a34fb86edd4f8415250c79a374e87bcf2e6870321261ca9b0f", user_slot_key);

    console.log(user_slot);

    let secret_value_key = starknet.hash.starknetKeccak("values_mapped_secret");

    secret_value_key = starknet.hash.pedersen([secret_value_key, user_slot]);

    console.log(secret_value_key);

    let secret_value = await provider.getStorageAt("0x067ed1d23c5cc3a34fb86edd4f8415250c79a374e87bcf2e6870321261ca9b0f", secret_value_key);

    console.log(secret_value);
}

solve();
