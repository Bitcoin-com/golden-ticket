"use strict"
const csv = require("csvtojson")
const prompt = require("prompt")

const main = async () => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(["eventName"], async (err, result) => {
    const csvFilePath = `${result.eventName}-final.csv`
    let totalUnclaimedTicketCount = 0
    let claimed1 = 0
    let claimed2 = 0
    let claimed5 = 0
    let claimed10 = 0
    let claimed500 = 0
    csv()
      .fromFile(csvFilePath)
      .then(jsonObj => {
        jsonObj.forEach((item, index) => {
          // console.log(item)
          if (item.claimed === "false") totalUnclaimedTicketCount += 1

          if (item.claimed === "true") {
            if (item.value === "1") claimed1 += 1
            else if (item.value === "2") claimed2 += 1
            else if (item.value === "5") claimed5 += 1
            else if (item.value === "10") claimed10 += 1
            else if (item.value === "500") claimed500 += 1
          }
        })
        console.log(
          `Ticket count: Total 1000, claimed ${1000 -
            totalUnclaimedTicketCount}, unclaimed ${totalUnclaimedTicketCount}`
        )
        console.log(
          `$1 breakdown: Total 919, claimed ${claimed1}, unclaimed ${919 -
            claimed1}`
        )
        console.log(
          `$2 breakdown: Total 50, claimed ${claimed2}, unclaimed ${50 -
            claimed2}`
        )
        console.log(
          `$5 breakdown: Total 20, claimed ${claimed5}, unclaimed ${20 -
            claimed5}`
        )
        console.log(
          `$10 breakdown: Total 10, claimed ${claimed10}, unclaimed ${10 -
            claimed10}`
        )
        console.log(
          `$500 breakdown: Total 1, claimed ${claimed500}, unclaimed ${1 -
            claimed500}`
        )
        const total =
          Number(claimed1) +
          claimed2 * 2 +
          claimed5 * 5 +
          claimed10 * 10 +
          claimed500 * 500
        console.log(
          `Funds claimed: Total: $1719, claimed $${total}, unclaimed $${1719 -
            total}`
        )
      })
  })
}

main()
