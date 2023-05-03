let sn = require("starknet");

let slot = 67;

let var_hashed = sn.hash.starknetKeccak('values_mapped_secret');
let key = sn.hash.pedersen([var_hashed, slot]);

console.log(key);
