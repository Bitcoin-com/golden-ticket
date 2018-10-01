const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const emoji = require("node-emoji");
const chalk = require("chalk");

console.log(chalk.green("All done."), emoji.get(":white_check_mark:"));

let mnemonic = BITBOX.Mnemonic.generate(256);
console.log(`Your mnemonic is: ${chalk.red(mnemonic)}`);

// root seed buffer
const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);

// master HDNode
const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed);

// HDNode of BIP44 account
const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

// HDNode of first internal change address
const funder = BITBOX.HDNode.derivePath(account, `1/0`);

// funder HDNode to cashAddr
const funderAddress = BITBOX.HDNode.toCashAddress(funder);

// show funder address qr code
console.log(`Send funds to: ${funderAddress}`);
qrcode.generate(funderAddress);

// mnemonic and funder address to save in basic wallet
let mnemonicObj = {
  mnemonic: mnemonic,
  funderAddress: funderAddress
};

// Write out the basic wallet into a json file for other scripts  to use.
fs.writeFile("mnemonic.json", JSON.stringify(mnemonicObj, null, 2), err => {
  if (err) return console.error(err);
  console.log(emoji.get(":rocket:"), `mnemonic.json written successfully.`);
});
