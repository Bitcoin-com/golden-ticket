const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();

let addresses = [];

// add your mnemonic here
// const mnemonic = BITBOX.Mnemonic.generate(256);
const mnemonic = "";

// root seed buffer
const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);

// master HDNode
const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "bitcoincash");

// HDNode of BIP44 account
const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
const funder = BITBOX.HDNode.derivePath(account, `1/0`);
const funderAddress = BITBOX.HDNode.toCashAddress(funder);

// add txid of funding tx
let txid = "";
// console.log(funderAddress);
BITBOX.Transaction.details(txid).then(result => {
  if (!result) {
    return;
  }

  // instance of transaction builder
  let transactionBuilder = new BITBOX.TransactionBuilder("bitcoincash");
  // original amount of satoshis in vin

  let addressCount = 40;
  let value = BITBOX.BitcoinCash.toSatoshi(result.vout[0].value);
  let originalAmount = value * addressCount;

  for (let i = 0; i < addressCount; i++) {
    transactionBuilder.addInput(txid, i);
  }

  // get byte count to calculate fee. paying 1 sat/byte
  let byteCount = BITBOX.BitcoinCash.getByteCount(
    { P2PKH: addressCount },
    { P2PKH: 1 }
  );

  // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
  let sendAmount = originalAmount - byteCount;
  // console.log(sendAmount, originalAmount, byteCount);

  transactionBuilder.addOutput(funderAddress, sendAmount);

  for (let i = 0; i < addressCount; i++) {
    // derive the ith external change address HDNode
    const node = BITBOX.HDNode.derivePath(account, `0/${i}`);

    let keyPair = BITBOX.HDNode.toKeyPair(node);

    // sign w/ HDNode
    let redeemScript;
    transactionBuilder.sign(
      i,
      keyPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      value
    );
  }

  // build tx
  let tx = transactionBuilder.build();
  // output rawhex
  let hex = tx.toHex();
  console.log(hex);

  // sendRawTransaction to running BCH node
  BITBOX.RawTransactions.sendRawTransaction(hex).then(
    result => {
      console.log(result);
    },
    err => {
      console.log(err);
    }
  );
});
