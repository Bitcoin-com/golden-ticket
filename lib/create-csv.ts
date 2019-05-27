// imports
import { BITBOX } from "bitbox-sdk"
import { HDNode } from "bitcoincashjs-lib"
import * as fs from "fs"
import { CreateCSV, CSV, Wallet } from "./interfaces/GoldenTicketInterfaces"

// consts
const bitbox: BITBOX = new BITBOX()
const converter = require("json-2-csv")
const emoji = require("node-emoji")
const chalk = require("chalk")
const addresses: CSV[] = []
const prompt = require("prompt")

// Open the wallet generated with generate-wallet.
const main: any = async (): Promise<any> => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(
    ["eventName", "hdAccount", "ticketCount"],
    async (err: any, result: CreateCSV): Promise<any> => {
      const json2csvCallback = (err: any, csv: any): void => {
        if (err) throw err
        fs.writeFile(
          `${result.eventName}.csv`,
          csv,
          (err: any): any => {
            if (err) return console.error(err)

            console.log(
              chalk.green("All done."),
              emoji.get(":white_check_mark:")
            )
            console.log(
              emoji.get(":rocket:"),
              `${result.eventName}.csv written successfully.`
            )
          }
        )
      }
      try {
        // Open the wallet generated with generate-wallet.
        const wallet: Wallet = require(`../goldenTicketWallet.json`)

        // ticket count
        const ticketCount: number = parseInt(result.ticketCount)

        // root seed buffer
        const rootSeed: Buffer = bitbox.Mnemonic.toSeed(wallet.mnemonic)

        // master HDNode
        const masterHDNode: HDNode = bitbox.HDNode.fromSeed(rootSeed)

        // BIP44
        const bip44: HDNode = bitbox.HDNode.derivePath(
          masterHDNode,
          "m/44'/145'"
        )

        for (let i: number = 0; i < ticketCount; i++) {
          const node: HDNode = bitbox.HDNode.derivePath(
            bip44,
            `${result.hdAccount}'/0/${i}`
          )

          // get the cash address
          const cashAddress: string = bitbox.HDNode.toCashAddress(node)

          // get the priv key in wallet import format
          const wif: string = bitbox.HDNode.toWIF(node)

          const obj: CSV = {
            cashAddress: cashAddress,
            wif: wif,
            claimed: "false"
          }

          if (i <= 2) obj.value = 1
          else if (i === 3) obj.value = 5
          else if (i === 4) obj.value = 10

          addresses.push(obj)
        }
        converter.json2csv(addresses, json2csvCallback)
      } catch (err) {
        console.log(
          `Could not open goldenTicketWallet.json. Generate a wallet with generate-wallet first.
      Exiting.`
        )
        process.exit(0)
      }
    }
  )
}

main()
