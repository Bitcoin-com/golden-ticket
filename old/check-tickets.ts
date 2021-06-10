// imports
import { BITBOX } from "bitbox-sdk"
import { AddressDetailsResult } from "bitcoin-com-rest"
import { HDNode } from "bitcoincashjs-lib"
import * as fs from "fs"
import { CheckTickets, CSV, Wallet } from "./interfaces/GoldenTicketInterfaces"

// consts
const bitbox: BITBOX = new BITBOX()
const converter = require("json-2-csv")
const prompt = require("prompt")
const addresses: any = []
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Open the wallet generated with generate-wallet.
const main: any = async (): Promise<any> => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(
    ["eventName", "hdAccount", "ticketCount"],
    async (err: any, result: CheckTickets): Promise<any> => {
      // eventName
      const eventName: string = result.eventName

      // hdAccount
      const hdAccount: string = result.hdAccount

      // ticket count
      const ticketCount: number = parseInt(result.ticketCount)

      const json2csvCallback: any = (err: any, csv: any): any => {
        if (err) throw err
        fs.writeFile(
          `${eventName}-final.csv`,
          csv,
          (err: any): any => {
            if (err) return console.error(err)
            console.log(`${eventName}-final.csv written successfully.`)
          }
        )
      }
      try {
        // Open the wallet generated with generate-wallet.
        const wallet: Wallet = require(`../goldenTicketWallet.json`)

        // root seed buffer
        const rootSeed: Buffer = bitbox.Mnemonic.toSeed(wallet.mnemonic)

        // master HDNode
        const masterHDNode: HDNode = bitbox.HDNode.fromSeed(rootSeed)

        // HDNode of BIP44 account
        const bip44: HDNode = bitbox.HDNode.derivePath(
          masterHDNode,
          `m/44'/145'`
        )

        for (let i: number = 0; i < ticketCount; i++) {
          await sleep(1100)
          // derive the ith external change address HDNode
          const node: HDNode = bitbox.HDNode.derivePath(
            bip44,
            `${hdAccount}'/0/${i}`
          )

          // get the cash address
          const cashAddress: string = bitbox.HDNode.toCashAddress(node)
          const details:
            | AddressDetailsResult
            | AddressDetailsResult[] = await bitbox.Address.details(cashAddress)
          if (!Array.isArray(details)) {
            const wif: string = bitbox.HDNode.toWIF(node)

            let value: number = 1
            if (i <= 2) value = 1
            else if (i === 3) value = 5
            else if (i === 4) value = 10

            let claimed = details.balance === 0
            const csv: CSV = {
              cashAddress: cashAddress,
              wif: wif,
              claimed: claimed.toString()
            }
            csv.value = value

            addresses.push(csv)
            console.log(i, cashAddress, wif, value, csv.claimed)
          }
        }
        converter.json2csv(addresses, json2csvCallback)
      } catch (err) {
        console.log(
          `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
        )
        process.exit(0)
      }
    }
  )
}

main()
