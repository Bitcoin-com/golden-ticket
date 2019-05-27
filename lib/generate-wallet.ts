// imports
import { BITBOX } from "bitbox-sdk"
import { HDNode } from "bitcoincashjs-lib"
import * as fs from "fs"
import { GenerateWalletResult } from "./interfaces/GoldenTicketInterfaces"

// consts
const bitbox: BITBOX = new BITBOX()
const emoji: any = require("node-emoji")
const chalk: any = require("chalk")
const prompt: any = require("prompt")

const main: any = async (): Promise<any> => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(
    ["language"],
    (err: any, result: GenerateWalletResult): void => {
      // generate mnemonic based on language input. Default to english
      const mnemonic: string = bitbox.Mnemonic.generate(
        256,
        bitbox.Mnemonic.wordLists()[
          result.language ? result.language.toLowerCase() : "english"
        ]
      )
      // show the user their mnemoninc
      console.log(`Your mnemonic is: ${chalk.red(mnemonic)}`)

      // root seed buffer
      const rootSeed: Buffer = bitbox.Mnemonic.toSeed(mnemonic)

      // master HDNode
      const masterHDNode: HDNode = bitbox.HDNode.fromSeed(rootSeed)

      // set the hdpath based on input. Default to BCH BIP44
      let hdpath: string = "m/44'/145'"
      console.log(`Your base HDPath is ${hdpath}`)

      let firstBIP44Account: string = `${hdpath}/0'`

      // HDNode of first BIP44 account
      const account: HDNode = bitbox.HDNode.derivePath(
        masterHDNode,
        firstBIP44Account
      )

      const mothershipHDPath: string = "1/0"
      const mothershipHDPathFormatted: string = `${firstBIP44Account}/${mothershipHDPath}`

      // HDNode of first internal change address
      const mothership: HDNode = bitbox.HDNode.derivePath(
        account,
        mothershipHDPath
      )
      console.log(`Your mothership's HDPath is ${mothershipHDPathFormatted}`)

      // mothership HDNode to cashAddr
      const mothershipAddress: string = bitbox.HDNode.toCashAddress(mothership)

      // mnemonic, hdpath and mothership address to save in basic wallet
      const mnemonicObj = {
        mnemonic: mnemonic,
        hdpath: hdpath,
        mothership: {
          hdPath: mothershipHDPathFormatted,
          address: mothershipAddress
        }
      }

      let walletFileName: string = "goldenTicketWallet.json"

      // Write out the basic wallet into a json file for other scripts  to use.
      fs.writeFile(
        `${walletFileName}`,
        JSON.stringify(mnemonicObj, null, 2),
        (err: any): void => {
          if (err) return console.error(err)

          console.log(chalk.green("All done."), emoji.get(":white_check_mark:"))
          console.log(
            emoji.get(":rocket:"),
            `${walletFileName} written successfully.`
          )
        }
      )
    }
  )
}

main()
