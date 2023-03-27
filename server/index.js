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
  const { sender, recipient, amount } = req.body;

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
// 26fba72c22d51803c4a0ddc3276077b45f6dbce55e351da6b027c23b8bebb8ac
// 04ce32d27a577a10b67dd6d2d3a7fabfadfec68f8dbc8a42ee8bc2a04376f5eabe9c1608d3eaa22ecba9b99d5bbe468dbf9f4a14c260a91b4eb44977a38921bc36
// a83daa4aab8157affb11bcf5b812e852a0a099b4
// macbook@MacBooks-MacBook-Pro server % node ./scripts/generate.js
// c20ff8e6f69e233f43fec7433aa72dbe454c586ba616be0621958088f9ba4ee3
// 04f6be390431da2b2aedd5202a960a445303ac5684b68e5714ae24a86457da22d108c7e2c544abbdd79d2c024610ed4476d89a17dc2dc2bb4b9e610df11d39ed60
// 60cdd89b5fcb795add17a9f58608a80c2e2ca552
// macbook@MacBooks-MacBook-Pro server % node ./scripts/generate.js
// cbdc081f9ef652d50715787392163efed428a418f8e61198e58c2d8e724a9495
// 040afe364392916deef79851d772c538823d3a29f30f1ea54f32c888c4b7a61eea8bc0a6f8228cd0dee409253069a8546f90984d57aa2e3e9c0cbd7fd997cd82da
// 6fc619371aaf1724fd76ae79bf80363691d95475

