const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();
const qrcode = require("qrcode-terminal");

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
console.log(`Send funds to: ${funderAddress}`);
qrcode.generate(funderAddress);
