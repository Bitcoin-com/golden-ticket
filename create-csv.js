"use strict"
const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default
const BITBOX = new BITBOXCli()
const converter = require("json-2-csv")
const fs = require("fs")
const emoji = require("node-emoji")
const chalk = require("chalk")
const addresses = []
const prompt = require("prompt")

// Open the wallet generated with generate-wallet.
const main = async () => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(
    ["eventName", "hdAccount", "addressCount"],
    async (err, result) => {
      const json2csvCallback = (err, csv) => {
        if (err) throw err
        fs.writeFile(`${result.eventName}.csv`, csv, err => {
          if (err) return console.error(err)

          console.log(chalk.green("All done."), emoji.get(":white_check_mark:"))
          console.log(
            emoji.get(":rocket:"),
            `${result.eventName} written successfully.`
          )
        })
      }
      let mnemonicObj
      try {
        mnemonicObj = require(`./goldenTicketWallet.json`)
      } catch (err) {
        console.log(
          `Could not open goldenTicketWallet.json. Generate a wallet with generate-wallet first.
      Exiting.`
        )
        process.exit(0)
      }

      // root seed buffer
      const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic)

      // master HDNode
      const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

      // HDNode of BIP44 account
      const account = BITBOX.HDNode.derivePath(masterHDNode, mnemonicObj.hdpath)

      for (let i = 0; i < result.addressCount; i++) {
        const node = BITBOX.HDNode.derivePath(
          account,
          `${result.hdAccount}/${i}`
        )

        // get the cash address
        const cashAddress = BITBOX.HDNode.toCashAddress(node)

        // get the priv key in wallet import format
        const wif = BITBOX.HDNode.toWIF(node)

        const obj = {
          cashAddress: cashAddress,
          wif: wif,
          claimed: false
        }

        if (i <= 2425) obj.value = 1
        else if (i >= 2426 && i <= 2474) obj.value = 2
        else if (i >= 2475 && i <= 2494) obj.value = 10
        else if (i >= 2495 && i <= 2497) obj.value = 100
        else if (i >= 2498 && i <= 2499) obj.value = 500

        addresses.push(obj)
        console.log(i, cashAddress, wif, obj.value, obj.claimed)
      }
      converter.json2csv(addresses, json2csvCallback)
    }
  )
}

main()
