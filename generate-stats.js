"use strict"
const fs = require("fs")
const csvFilePath = "anarchapulco-final.csv"
const csv = require("csvtojson")

// if (i <= 299) obj.value = 100
// else if (i >= 300 && i <= 979) obj.value = 200
// else if (i >= 980 && i <= 997) obj.value = 500
// else if (i >= 998 && i <= 999) obj.value = 5000

const main = async () => {
  let totalUnclaimedTicketCount = 0
  let claimed1 = 0
  let claimed2 = 0
  let claimed10 = 0
  let claimed100 = 0
  let claimed500 = 0
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      jsonObj.forEach((item, index) => {
        console.log(item)
        if (item.claimed === "false") totalUnclaimedTicketCount += 1

        if (item.claimed === "true") {
          if (item.value === "1") claimed1 += 1
          else if (item.value === "2") claimed2 += 1
          else if (item.value === "10") claimed10 += 1
          else if (item.value === "100") claimed100 += 1
          else if (item.value === "500") claimed500 += 1
        }
      })
      console.log(
        `Ticket count: Total 2500, claimed ${2500 -
          totalUnclaimedTicketCount}, unclaimed ${totalUnclaimedTicketCount}`
      )
      console.log(
        `1 breakdown: claimed ${claimed1}, unclaimed ${2426 - claimed1}`
      )
      console.log(
        `2 breakdown: claimed ${claimed2}, unclaimed ${50 - claimed2}`
      )
      console.log(
        `10 breakdown: claimed ${claimed10}, unclaimed ${20 - claimed10}`
      )
      console.log(
        `100 breakdown: claimed ${claimed100}, unclaimed ${3 - claimed100}`
      )
      console.log(
        `500 breakdown: claimed ${claimed500}, unclaimed ${1 - claimed500}`
      )
      const total =
        Number(claimed1) +
        claimed2 * 2 +
        claimed10 * 10 +
        claimed100 * 100 +
        claimed500 * 500
      console.log(
        `Total funds claimed: claimed ${total}, unclaimed ${3526 - total}`
      )
    })
}

main()
