# Generate Wallet

## Prerequisites

Install the NodeJS LTS version from [https://nodejs.org/en/](https://nodejs.org/en/). At the time of writing that is 10.15.3. This also comes bundled w/ `npm` for installing dependencies and running scripts.

## Installation

Clone the repo

```
git clone https://github.com/Bitcoin-com/golden-ticket.git
```

Change directories to the newly cloned codebase

```
cd golden-ticket
```

Install the dependencies

```
npm install
```

Transpile the typescript to javascript

```
npm run build
```

You can now start running the Golden Ticket commands. A typical workflow is:

- generate-wallet
- create-addresses
- create-csv
- fund-mothership
- fund-addresses
- check-addresses
- generate-stats
- reclaim-funds
