import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import {toHex} from 'ethereum-cryptography/utils'
import {keccak256} from 'ethereum-cryptography/keccak'
import { useEffect } from 'react';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey
}) {
  useEffect(() => {
    async function fetchBalance() {
      if (address) {
        const { data: { balance } } = await server.get(`balance/${address}`);
        await setBalance(balance);
      } else {
        await setBalance(0);
      }
    }
    fetchBalance();
  }, [address, setBalance]);

  const onChange = async (evt) => {
    evt.preventDefault();
    const privKey = evt.target.value;
    await setPrivateKey(() => privKey);
    const publicKey = secp.getPublicKey(privKey);
    const newAddress = '0x' + toHex(keccak256(publicKey).slice(-20));
    await setAddress(() => newAddress);
    console.log(newAddress);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input placeholder="Type a private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div className="balance">Address: {address}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
