## Golden Ticket

Event paper wallet generator

### Setup

1. Clone the repo

- `git clone https://github.com/Bitcoin-com/golden-ticket.git`

2. Install the dependencies

- `cd golden-ticket && npm install`

### Create addresses

1. Open `create-addresses.js` and add your mnemonic
2. `npm run create-addresses`. This will create `n` paper wallets w/ cashAddr and privkeyWIF. This will also create `addresses.csv` for importing in to a spreadsheet.
