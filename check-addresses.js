"use strict"
const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default
const BITBOX = new BITBOXCli()
const converter = require("json-2-csv")
const fs = require("fs")
const prompt = require("prompt")
const addresses = []
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
        fs.writeFile(`${result.eventName}-final.csv`, csv, err => {
          if (err) return console.error(err)
          console.log(`${result.eventName}-final.csv written successfully.`)
        })
      }
      let mnemonicObj
      try {
        mnemonicObj = require(`./goldenTicketWallet.json`)
      } catch (err) {
        console.log(
          `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
        )
        process.exit(0)
      }

      // address count
      const addressCount = result.addressCount

      // root seed buffer
      const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic)

      // master HDNode
      const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

      // HDNode of BIP44 account
      const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
      for (let i = 0; i <= addressCount; i++) {
        await sleep(1100)
        // derive the ith external change address HDNode
        const node = BITBOX.HDNode.derivePath(
          account,
          `${result.hdAccount}/${i}`
        )

        // get the cash address
        const cashAddress = BITBOX.HDNode.toCashAddress(node)
        const details = await BITBOX.Address.details([cashAddress])

        const wif = BITBOX.HDNode.toWIF(node)

        let value
        if (i <= 2426) value = 1
        else if (i >= 2427 && i <= 2476) value = 2
        else if (i >= 2477 && i <= 2496) value = 10
        else if (i >= 2497 && i <= 2498) value = 100
        else if (i === 2500) value = 500

        const obj = {
          cashAddress: cashAddress,
          wif: wif,
          claimed: details[0].balance === 0
        }
        obj.value = value

        addresses.push(obj)
        console.log(i, cashAddress, wif, value, obj.claimed)
      }
      converter.json2csv(addresses, json2csvCallback)
    }
  )
}

main()
