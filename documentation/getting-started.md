# Getting started

## Prerequisites

Install the NodeJS LTS version from [nodejs.org](https://nodejs.org/en/). At the time of writing that is 10.15.3. This also comes bundled w/ `npm` for installing dependencies and running scripts.

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

You can now run the Golden Ticket commands. A typical workflow is:

- [generate-wallet](generate-wallet.md)
- [create-addresses](create-addresses.md)
- [create-csv](create-csv.md)
- [fund-mothership](fund-mothership.md)
- [fund-addresses](fund-addresses.md)
- [check-addresses](check-addresses.md)
- [generate-stats](generate-stats.md)
- [reclaim-funds](reclaim-funds.md)
