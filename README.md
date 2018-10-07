## Golden Ticket

![Golden Ticket](images/golden-ticket.jpg)

Golden Ticket is [Bitcoin.com's](https://www.bitcoin.com) event paper wallet generator. Use it to create amazing golden tickets for your next event.

Not only does Golden Ticket let you chose a custom mnemonic language or hdpath but it also generates html, pdf and a spreadsheet mapping cashAddr, privKey, index and claimed status of each golden ticket.

## Features

- Generates mnemonic in 8 languages w/ custom HDPath

## Setup

Clone the repo

`git clone https://github.com/Bitcoin-com/golden-ticket.git`

Install the dependencies

`cd golden-ticket && npm install`

## Generate mnemonic

Create a 256 bit mnemonic in any of the following languages

- english
- spanish
- french
- italian
- japanese
- korean
- chinese_simplified
- chinese_traditional

`npm run generate-mnemonic`

You'll be prompted for a languag. You can enter any of the 8 listed above. If you don't enter a language Golden Ticket will default to English.

This will next generate the funder's address at HD path: `m/44'/145'/0'/1/0`. It will also show the funder's address as a QR code and save the mnemonic and funder address to `mnemonic.js`.

## Create addresses

Run `npm run create-addresses`.

This will create `n` privkeyWIFs as a QR code saved to a PDF.

## Redeem Unclaimed Funds

Run `npm run redeem-unclaimed-funds` to have funds sent back to the funders cashAddr
