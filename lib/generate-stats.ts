// imports
import { CSV, GenerateStats } from "./interfaces/GoldenTicketInterfaces"

// consts
const csv: any = require("csvtojson")
const prompt: any = require("prompt")

const main: any = async (): Promise<any> => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(
    ["eventName"],
    async (err: any, result: GenerateStats): Promise<any> => {
      const csvFilePath: string = `${result.eventName}-final.csv`
      let totalUnclaimedTicketCount: number = 0
      let claimed1: number = 0
      let claimed5: number = 0
      let claimed10: number = 0
      csv()
        .fromFile(csvFilePath)
        .then(
          (jsonObj: any): void => {
            jsonObj.forEach(
              (item: CSV): void => {
                // console.log(item)
                if (item.claimed === "false") totalUnclaimedTicketCount += 1

                if (item.claimed === "true" && item.value) {
                  if (item.value.toString() === "1") claimed1 += 1
                  else if (item.value.toString() === "5") claimed5 += 1
                  else if (item.value.toString() === "10") claimed10 += 1
                }
              }
            )
            console.log(
              `Ticket count: Total 5, claimed ${5 -
                totalUnclaimedTicketCount}, unclaimed ${totalUnclaimedTicketCount}`
            )
            console.log(
              `$1 breakdown: Total 3, claimed ${claimed1}, unclaimed ${3 -
                claimed1}`
            )
            console.log(
              `$5 breakdown: Total 1, claimed ${claimed5}, unclaimed ${1 -
                claimed5}`
            )
            console.log(
              `$10 breakdown: Total 1, claimed ${claimed10}, unclaimed ${1 -
                claimed10}`
            )
            const total: number =
              Number(claimed1) + claimed5 * 5 + claimed10 * 10
            console.log(
              `Funds claimed: Total: $18, claimed $${total}, unclaimed $${18 -
                total}`
            )
          }
        )
    }
  )
}

main()
