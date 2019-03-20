"use strict"
const qrcode = require("qrcode-terminal")
const chalk = require("chalk")
const emoji = require("node-emoji")

let mnemonicObj
try {
  mnemonicObj = require(`./goldenTicketWallet.json`)
} catch (err) {
  console.log(
    `Could not open mnemonic.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
  )
  process.exit(0)
}

// show funder address qr code
console.log(`Send funds to: ${mnemonicObj.mothership.address}`)
qrcode.generate(mnemonicObj.mothership.address)
console.log(chalk.green("All done."), emoji.get(":white_check_mark:"))
