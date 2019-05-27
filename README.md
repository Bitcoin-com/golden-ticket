# Golden Ticket

![Golden Ticket](images/gts.jpg)

Golden Ticket is [Bitcoin.com's](https://www.bitcoin.com) event paper wallet generator. Use it to create amazing golden tickets for your next event.

Not only does Golden Ticket let you chose a custom mnemonic language or hdpath but it also generates html, pdf and a spreadsheet mapping cashAddr, privKey, index and swept status of each golden ticket as well as generating stats and reclaiming unclaimed funds.

## Features

- Generate mnemonic in 1 of 8 languages (english, japanese, chinese_simplified, chinese_traditional, french, italian, japanese, korean, spanish)
- Generate basic BIP44 wallet
- Create Golden Tickets in html and pdf format for printing.
- Create .csv file w/ cash address, wif and ticket tier breakdown
- Fund all tickets programmatically
- Check with tickets have been claimed and generate stats report
- Sweep unclaimed funds back to your wallet

## Getting started

[getting-started](documentation/getting-started.md)

## Workflow

A typical workflow is

1. [generate-wallet](documentation/generate-wallet.md)
2. [create-tickets](documentation/create-tickets.md)
3. [create-csv](documentation/create-csv.md)
4. [fund-mothership](documentation/fund-mothership.md)
5. [fund-tickets](documentation/fund-tickets.md)
6. [check-tickets](documentation/check-tickets.md)
7. [generate-stats](documentation/generate-stats.md)
8. [reclaim-funds](documentation/reclaim-funds.md)
