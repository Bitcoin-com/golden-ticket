let BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
let BITBOX = new BITBOXCli();
let converter = require("json-2-csv");
let QRCode = require("qrcode");
let touch = require("touch");
const fs = require("fs");

let addresses = [];

// add your mnemonic here
const mnemonic = BITBOX.Mnemonic.generate(256);

// root seed buffer
const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);

// master HDNode
const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "bitcoincash");

// HDNode of BIP44 account
const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
for (let i = 0; i <= 40; i++) {
  // derive the ith external change address HDNode
  const node = BITBOX.HDNode.derivePath(account, `0/${i}`);

  // get the cash address
  const cashAddress = BITBOX.HDNode.toCashAddress(node);

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

let json2csvCallback = function(err, csv) {
  if (err) throw err;
  // console.log(csv);
  fs.writeFile("addresses.csv", csv, function(err) {
    if (err) return console.error(err);
    console.log(`addresses.csv written successfully.`);
  });
};

converter.json2csv(addresses, json2csvCallback);
