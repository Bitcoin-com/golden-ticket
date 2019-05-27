// imports
import { Wallet } from "./interfaces/GoldenTicketInterfaces"

// consts
const qrcode: any = require("qrcode-terminal")
const chalk: any = require("chalk")
const emoji: any = require("node-emoji")

try {
  // Open the wallet generated with generate-wallet.
  const wallet: Wallet = require(`../goldenTicketWallet.json`)

  // show funder address qr code
  console.log(`Send funds to: ${wallet.mothership.address}`)
  qrcode.generate(wallet.mothership.address)
  console.log(
    `Check your mothership address on the explorer: https://explorer.bitcoin.com/bch/address/${
      wallet.mothership.address
    }`
  )
} catch (err) {
  console.log(
    `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
  )
  process.exit(0)
}
console.log(chalk.green("All done."), emoji.get(":white_check_mark:"))
