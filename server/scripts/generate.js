import secp from 'ethereum-cryptography/secp256k1.js'
import {toHex} from 'ethereum-cryptography/utils.js'
import {keccak256} from 'ethereum-cryptography/keccak.js'

const privateKey = secp.utils.randomPrivateKey()
const publicKey = secp.getPublicKey(privateKey)
const address = keccak256(publicKey).slice(-20)
console.log(toHex(privateKey))
console.log(toHex(publicKey))
console.log(toHex(address))