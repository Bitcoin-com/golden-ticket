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
  fs.writeFile("post-event.csv", csv, err => {
    if (err) return console.error(err);
    console.log(`post-event.csv written successfully.`);
  });
};

// Open the wallet generated with create-wallet.
let main = async () => {
  let mnemonicObj;
  try {
    mnemonicObj = require(`./wallet.json`);
  } catch (err) {
    console.log(
      `Could not open wallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
    );
    process.exit(0);
  }

  // address count
  let addressCount = 75;

  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic);

  // master HDNode
  const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed);

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
  for (let i = 0; i <= addressCount; i++) {
    await sleep(1100);
    // derive the ith external change address HDNode
    const node = BITBOX.HDNode.derivePath(account, `1/${i}`);

    // get the cash address
    const cashAddress = BITBOX.HDNode.toCashAddress(node);
    let details = await BITBOX.Address.details([cashAddress]);

    const wif = BITBOX.HDNode.toWIF(node);

    let value;
    if (i <= 74) {
      value = 5;
    } else if (i === 75) {
      value = 150;
    }

    let obj = {
      cashAddress: cashAddress,
      wif: wif,
      claimed: details[0].balance === 0
    };
    obj.value = value;

    addresses.push(obj);
    console.log(i, cashAddress, wif, value, obj.claimed);
  }
  converter.json2csv(addresses, json2csvCallback);
};

main();
