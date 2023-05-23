const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xa83daa4aab8157affb11bcf5b812e852a0a099b4": 100,
  "0x60cdd89b5fcb795add17a9f58608a80c2e2ca552": 50,
  "0x6fc619371aaf1724fd76ae79bf80363691d95475": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  const [sig, recoveryBit] = signature;
  const sig2 = Uint8Array.from(Object.values(sig))


  const hashedMsg = keccak256(utf8ToBytes(`${parseInt(amount)}`))
  const recove = secp.recoverPublicKey(hashedMsg, sig2, recoveryBit)
  const recoveredPubKey = '0x'+ (toHex(keccak256(recove).slice(-20)))

  if (recoveredPubKey !== sender) {
    res.status(400).send({ message: "Invalid signature!" });
  }


  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

