"use strict";
const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();
const converter = require("json-2-csv");
const QRCode = require("qrcode");
const touch = require("touch");
const mkdirp = require("mkdirp");
const fs = require("fs");
const pdf = require("html-pdf");
const emoji = require("node-emoji");
const chalk = require("chalk");
let addresses = [];

let json2csvCallback = (err, csv) => {
  if (err) throw err;
  fs.writeFile("addresses.csv", csv, err => {
    if (err) return console.error(err);
    console.log(`addresses.csv written successfully.`);
  });
};

// Open the wallet generated with create-wallet.
let mnemonicObj;
try {
  mnemonicObj = require(`./mnemonic.json`);
} catch (err) {
  console.log(
    `Could not open mnemonic.json. Generate a mnemonic with generate-mnemonic first.
    Exiting.`
  );
  process.exit(0);
}

mkdirp(`./html`, err => {});
mkdirp(`./html/cashAddresses`, err => {});
mkdirp(`./html/privKeyWIFs`, err => {});
mkdirp(`./pdf`, err => {});
mkdirp(`./pdf/cashAddresses`, err => {});
mkdirp(`./pdf/privKeyWIFs`, err => {});

const funderAddress = mnemonicObj.funderAddress;
console.log(funderAddress);
// return false;
let addressCount = 20;
// root seed buffer
const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic);

// master HDNode
const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed);

// HDNode of BIP44 account
const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

for (let i = 0; i < addressCount; i++) {
  // derive the ith external change address HDNode
  const node = BITBOX.HDNode.derivePath(account, `0/${i}`);

  // get the cash address
  const cashAddress = BITBOX.HDNode.toCashAddress(node);
  const wif = BITBOX.HDNode.toWIF(node);
  addresses.push({
    cashAddr: cashAddress,
    wif: wif
  });
  console.log(cashAddress, wif);
  touch(`./html/cashAddresses/paper-wallet-cashAddr-${i}.html`);
  QRCode.toDataURL(cashAddress, (err, addressQR) => {
    fs.writeFileSync(
      `./html/cashAddresses/paper-wallet-cashAddr-${i}.html`,
      `
      <div>
        <p><img src='${addressQR}' /></p>
      </div>
    `
    );
  });

  let cashAddressesHtml = fs.readFileSync(
    `./html/cashAddresses/paper-wallet-cashAddr-${i}.html`,
    "utf8"
  );
  let options = { format: "Letter" };
  pdf
    .create(cashAddressesHtml, options)
    .toFile(
      `./pdf/cashAddresses/paper-wallet-cashAddr-${i}.pdf`,
      (err, res) => {
        if (err) return console.log(err);
      }
    );

  touch(`./html/privKeyWIFs/paper-wallet-wif-${i}.html`);
  QRCode.toDataURL(wif, (err, wifQR) => {
    fs.writeFileSync(
      `./html/privKeyWIFs/paper-wallet-wif-${i}.html`,
      `
      <div>
        <p><img src='${wifQR}' /></p>
      </div>
    `
    );
  });

  let privKeyWIFsHtml = fs.readFileSync(
    `./html/privKeyWIFs/paper-wallet-wif-${i}.html`,
    "utf8"
  );
  pdf
    .create(privKeyWIFsHtml, options)
    .toFile(`./pdf/privKeyWIFs/paper-wallet-wif-${i}.pdf`, (err, res) => {
      if (err) return console.log(err);
    });
}

console.log(chalk.green("All done."), emoji.get(":white_check_mark:"));
console.log(emoji.get(":rocket:"), `html and pdfs written successfully.`);
