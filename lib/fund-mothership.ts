// imports
import { Wallet } from "./interfaces/GoldenTicketInterfaces"

// consts
const qrcode = require("qrcode-terminal")
const chalk = require("chalk")
const emoji = require("node-emoji")

try {
  const wallet: Wallet = require(`../goldenTicketWallet.json`)

  // show funder address qr code
  console.log(`Send funds to: ${wallet.mothership.address}`)
  qrcode.generate(wallet.mothership.address)
} catch (err) {
  console.log(
    `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
  )
  process.exit(0)
}
console.log(chalk.green("All done."), emoji.get(":white_check_mark:"))
