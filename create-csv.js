"use strict";
const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();
const converter = require("json-2-csv");
const fs = require("fs");
const emoji = require("node-emoji");
const chalk = require("chalk");
let addresses = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let json2csvCallback = (err, csv) => {
  if (err) throw err;
  fs.writeFile("addresses1.csv", csv, err => {
    if (err) return console.error(err);
    console.log(`addresses.csv written successfully.`);
  });
};

// Open the wallet generated with generate-wallet.
let main = async () => {
  let mnemonicObj;
  try {
    mnemonicObj = require(`./wallet1.json`);
  } catch (err) {
    console.log(
      `Could not open wallet.json. Generate a wallet with generate-wallet first.
      Exiting.`
    );
    process.exit(0);
  }

  // address count
  let ticketCount = mnemonicObj.numberOfTickets;

  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic);

  // master HDNode
  const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed);

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, mnemonicObj.hdpath);

  for (let i = 0; i <= ticketCount; i++) {
    const node = BITBOX.HDNode.derivePath(account, `0/${i}`);

    // get the cash address
    const cashAddress = BITBOX.HDNode.toCashAddress(node);

    // get the priv key in wallet import format
    const wif = BITBOX.HDNode.toWIF(node);

    let obj = {
      cashAddress: cashAddress,
      wif: wif,
      claimed: false
    };

    mnemonicObj.tiers.forEach((tier, index) => {
      if (index === 0 && i <= tier[1]) {
        obj.value = tier[0];
      }
    });
    // if (i <= 74) {
    //   // 75 addresses w/ $5
    //   value = 5;
    // } else if (i === 75) {
    //   // 1 address w/ $150
    //   value = 150;
    // }

    addresses.push(obj);
    console.log(i, cashAddress, wif, value, obj.claimed);
  }
  converter.json2csv(addresses, json2csvCallback);
  console.log(chalk.green("All done."), emoji.get(":white_check_mark:"));
};

main();
