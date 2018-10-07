const fs = require("fs");
const csvFilePath = "post-event.csv";
const csv = require("csvtojson");
let main = async () => {
  let totalUnclaimedTicketCount = 0;
  let claimed5 = 0;
  let claimed150 = 0;
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      jsonObj.forEach((item, index) => {
        console.log(item);
        if (item.claimed === "false") {
          totalUnclaimedTicketCount += 1;
        }

        if (item.claimed === "true") {
          if (item.value === "5") {
            claimed5 += 1;
          } else if (item.value === "150") {
            claimed150 += 1;
          }
        }
      });
      console.log(
        `Ticket count: Total 75, claimed ${75 -
          totalUnclaimedTicketCount}, unclaimed ${totalUnclaimedTicketCount}`
      );
      console.log(
        `$5 breakdown: claimed ${claimed5}, unclaimed ${74 - claimed5}`
      );
      console.log(
        `$150 breakdown: claimed ${claimed150}, unclaimed ${1 - claimed150}`
      );
      let total = claimed5 * 5 + claimed150 * 150;
      console.log(
        `Total funds claimed: claimed ${total}, unclaimed ${520 - total}`
      );
    });
};

main();
