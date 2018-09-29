const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();
const fs = require("fs");
const qrcode = require("qrcode-terminal");

let mnemonic = BITBOX.Mnemonic.generate(256);
console.log(`Your mnemonic is: ${mnemonic}`);

// root seed buffer
const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);

// master HDNode
const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed);

// HDNode of BIP44 account
const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

// first internal change address
const funder = BITBOX.HDNode.derivePath(account, `1/0`);

const funderAddress = BITBOX.HDNode.toCashAddress(funder);
console.log(`Send funds to: ${funderAddress}`);
qrcode.generate(funderAddress);
let mnemonicObj = {
  mnemonic: mnemonic,
  funderAddress: funderAddress
};

// Write out the basic information into a json file for other apps to use.
fs.writeFile("mnemonic.json", JSON.stringify(mnemonicObj, null, 2), function(
  err
) {
  if (err) return console.error(err);
  console.log(`mnemonic.json written successfully.`);
});
