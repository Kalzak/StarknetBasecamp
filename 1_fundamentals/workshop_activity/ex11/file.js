let starknet = require('starknet');

async function solve() {

    const provider = new starknet.Provider({
        sequencer: {
            network: 'goerli-alpha'
        }    
    })

    const storage_key = starknet.hash.starknetKeccak("ex11_secret_value");

    const value = await provider.getStorageAt("0x029a9a484d22a6353eff0d60ea56c6ffabaaac5e4889182287ef1d261578b197", storage_key);

    console.log(value);
}

solve();
