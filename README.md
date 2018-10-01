## Golden Ticket

Event paper wallet generator

### Setup

1. Clone the repo

- `git clone https://github.com/Bitcoin-com/golden-ticket.git`

2. Install the dependencies

- `cd golden-ticket && npm install`

### Generate mnemonic

1. Create an English 256 bit mnemonic of 24 words.

- `npm run generate-mnemonic`

This will next generate the funder's address at HD path: `m/44'/145'/0'/1/0`. It will also show the funder's address as a QR code and save the mnemonic and funder address to `mnemonic.js`.

### Create addresses

Run `npm run create-addresses`.

This will create `n` privkeyWIFs as a QR code saved to a PDF.

### Redeem Unclaimed Funds

Run `npm run redeem-unclaimed-funds` to have funds sent back to the funders cashAddr
