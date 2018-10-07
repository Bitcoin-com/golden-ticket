const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const emoji = require("node-emoji");
const chalk = require("chalk");
const prompt = require("prompt");

console.log(chalk.green("All done."), emoji.get(":white_check_mark:"));

let main = async () => {
  prompt.start();

  prompt.get(["language", "hdpath"], (err, result) => {
    let mnemonic = BITBOX.Mnemonic.generate(
      256,
      BITBOX.Mnemonic.wordLists()[result.language ? result.language : "english"]
    );
    console.log(`Your mnemonic is: ${chalk.red(mnemonic)}`);

    // root seed buffer
    const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);

    // master HDNode
    const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed);

    let hdpath;
    if (result.hdpath) {
      hdpath = result.hdpath;
    } else {
      hdpath = "m/44'/145'/0'";
    }

    console.log(`Your account's HDPath is ${hdpath}`);
    // HDNode of BIP44 account
    const account = BITBOX.HDNode.derivePath(masterHDNode, hdpath);

    // HDNode of first internal change address
    const mothership = BITBOX.HDNode.derivePath(account, `1/0`);
    console.log(`Your mothership's HDPath is ${hdpath}/1/0`);

    // mothership HDNode to cashAddr
    const mothershipAddress = BITBOX.HDNode.toCashAddress(mothership);

    // show mothership address qr code
    console.log(`Fund the mothership at: ${mothershipAddress}\n`);
    qrcode.generate(mothershipAddress);

    // mnemonic and mothership address to save in basic wallet
    let mnemonicObj = {
      mnemonic: mnemonic,
      mothershipAddress: mothershipAddress
    };

    // Write out the basic wallet into a json file for other scripts  to use.
    fs.writeFile("wallet.json", JSON.stringify(mnemonicObj, null, 2), err => {
      if (err) return console.error(err);
      console.log(emoji.get(":rocket:"), `wallet.json written successfully.`);
    });
  });
};

main();
