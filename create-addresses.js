const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();
const converter = require("json-2-csv");
const QRCode = require("qrcode");
const touch = require("touch");
const fs = require("fs");

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
// console.log(funderAddress);
BITBOX.Address.utxo(funderAddress).then(result => {
  if (!result[0]) {
    return;
  }
  // console.log(result[0]);

  // instance of transaction builder
  let transactionBuilder = new BITBOX.TransactionBuilder("bitcoincash");
  // original amount of satoshis in vin
  let originalAmount = result[0].satoshis;

  // index of vout
  let vout = result[0].vout;

  // txid of vout
  let txid = result[0].txid;

  transactionBuilder.addInput(txid, vout);

  let addressCount = 40;

  // get byte count to calculate fee. paying 1 sat/byte
  let byteCount = BITBOX.BitcoinCash.getByteCount(
    { P2PKH: 1 },
    { P2PKH: addressCount }
  );

  // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
  let sendAmount = originalAmount - byteCount;

  for (let i = 0; i < addressCount; i++) {
    // derive the ith external change address HDNode
    const node = BITBOX.HDNode.derivePath(account, `0/${i}`);

    // get the cash address
    const cashAddress = BITBOX.HDNode.toCashAddress(node);

    transactionBuilder.addOutput(
      cashAddress,
      Math.floor(sendAmount / addressCount)
    );

    // get the private key wallet import format
    const wif = BITBOX.HDNode.toWIF(node);
    addresses.push({
      cashAddr: cashAddress,
      wif: wif
    });
    touch(`./paper-wallet-${i}.html`);
    QRCode.toDataURL(wif, (err, privateKeyWIFQR) => {
      QRCode.toDataURL(cashAddress, (err, addressQR) => {
        fs.writeFileSync(
          `./paper-wallet-${i}.html`,
          `
          <div>
            <h2>Private Key WIF</h2>
            <p>${wif}</p>
            <p><img src='${privateKeyWIFQR}' /></p>
          </div>
          <div>
            <h2>Public address</h2>
            <p>${cashAddress}</p>
            <p><img src='${addressQR}' /></p>
          </div>
        `
        );
      });
    });
  }

  let keyPair = BITBOX.HDNode.toKeyPair(funder);

  // sign w/ HDNode
  let redeemScript;
  transactionBuilder.sign(
    0,
    keyPair,
    redeemScript,
    transactionBuilder.hashTypes.SIGHASH_ALL,
    originalAmount
  );

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

let json2csvCallback = (err, csv) => {
  if (err) throw err;
  // console.log(csv);
  fs.writeFile("addresses.csv", csv, err => {
    if (err) return console.error(err);
    console.log(`addresses.csv written successfully.`);
  });
};

converter.json2csv(addresses, json2csvCallback);
