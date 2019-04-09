"use strict"
const BITBOXSDK = require("bitbox-sdk")
const BITBOX = new BITBOXSDK()
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
      // eventName
      const eventName = result.eventName

      // hdAccount
      const hdAccount = result.hdAccount

      // address count
      const addressCount = result.addressCount

      const json2csvCallback = (err, csv) => {
        if (err) throw err
        fs.writeFile(`${eventName}-final.csv`, csv, err => {
          if (err) return console.error(err)
          console.log(`${eventName}-final.csv written successfully.`)
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

      // root seed buffer
      const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic)

      // master HDNode
      const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

      // HDNode of BIP44 account
      const bip44 = BITBOX.HDNode.derivePath(masterHDNode, `m/44'/145'`)
      for (let i = 0; i <= addressCount; i++) {
        await sleep(1100)
        // derive the ith external change address HDNode
        const node = BITBOX.HDNode.derivePath(bip44, `${hdAccount}'/0/${i}`)

        // get the cash address
        const cashAddress = BITBOX.HDNode.toCashAddress(node)
        const details = await BITBOX.Address.details([cashAddress])

        const wif = BITBOX.HDNode.toWIF(node)

        let value
        if (i <= 918) value = 1
        else if (i >= 919 && i <= 968) value = 2
        else if (i >= 969 && i <= 988) value = 5
        else if (i >= 989 && i <= 998) value = 10
        else if (i === 999) value = 500

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
