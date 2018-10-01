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
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let json2csvCallback = (err, csv) => {
  if (err) throw err;
  fs.writeFile("addresses.csv", csv, err => {
    if (err) return console.error(err);
    console.log(`addresses.csv written successfully.`);
  });
};

// Open the wallet generated with create-wallet.
let main = async () => {
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

  // create needed directory structure
  mkdirp(`./html`, err => {});
  // mkdirp(`./html/cashAddresses`, err => {});
  mkdirp(`./html/privKeyWIFs`, err => {});
  mkdirp(`./pdf`, err => {});
  // mkdirp(`./pdf/cashAddresses`, err => {});
  mkdirp(`./pdf/privKeyWIFs`, err => {});

  // address count
  let addressCount = 2000;

  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic);

  // master HDNode
  const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed);

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

  for (let i = 0; i < addressCount; i++) {
    console.log(`html: ${i}`);
    await sleep(100);
    // derive the ith external change address HDNode
    const node = BITBOX.HDNode.derivePath(account, `0/${i}`);

    // get the cash address
    const cashAddress = BITBOX.HDNode.toCashAddress(node);

    // get the priv key in wallet import format
    const wif = BITBOX.HDNode.toWIF(node);
    addresses.push({
      wif: wif
    });

    // console.log(cashAddress, wif );

    // create empty html file
    // touch(`./html/cashAddresses/paper-wallet-cashAddr-${i}.html`);
    //
    // // create qr code for cashAddr
    // QRCode.toDataURL(cashAddress, (err, addressQR) => {
    //   // save to html file
    //   fs.writeFileSync(
    //     `./html/cashAddresses/paper-wallet-cashAddr-${i}.html`,
    //     `
    //     <div>
    //       <p><img src='${addressQR}' /></p>
    //     </div>
    //     `
    //   );
    // });
    //
    // create empty html file
    touch(`./html/privKeyWIFs/paper-wallet-wif-${i}.html`);

    // create qr code
    QRCode.toDataURL(wif, (err, wifQR) => {
      // save to html file
      fs.writeFileSync(
        `./html/privKeyWIFs/paper-wallet-wif-${i}.html`,
        `
        <div>
          <p><img src='${wifQR}' /></p>
        </div>
      `
      );
    });
  }

  for (let i = 0; i < addressCount; i++) {
    console.log(`pdf: ${i}`);
    await sleep(250);
    // get html file
    // let cashAddressesHtml = fs.readFileSync(
    //   `./html/cashAddresses/paper-wallet-cashAddr-${i}.html`,
    //   "utf8"
    // );

    // save to pdf
    let options = { format: "Letter" };
    // pdf
    //   .create(cashAddressesHtml, options)
    //   .toFile(
    //     `./pdf/cashAddresses/paper-wallet-cashAddr-${i}.pdf`,
    //     (err, res) => {
    //       if (err) return console.log(err);
    //     }
    //   );

    // get html file
    let privKeyWIFsHtml = fs.readFileSync(
      `./html/privKeyWIFs/paper-wallet-wif-${i}.html`,
      "utf8"
    );

    // save to pdf
    pdf
      .create(privKeyWIFsHtml, options)
      .toFile(`./pdf/privKeyWIFs/paper-wallet-wif-${i}.pdf`, (err, res) => {
        if (err) return console.log(err);
      });
  }
  // converter.json2csv(addresses, json2csvCallback);
  console.log(chalk.green("All done."), emoji.get(":white_check_mark:"));
  console.log(emoji.get(":rocket:"), `html and pdfs written successfully.`);
};

main();
