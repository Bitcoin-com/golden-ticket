# Create CSV

Often there is more than one stakeholder in a project. For example at bitcoin.com when we create Golden Tickets for an event our Marketing team funds the event and keeps track of the metrics around which how many tickets were claimed. `create-csv` allow you to create a .csv with the `cashAddress`, `wif`, `claimed` and `value` for each Golden Ticket. This can be shared with your team so that everyone knows the addresses and private keys of all Golden Tickets. Also this .csv is used later w/ the `generate-stats` command.

When you run `create-csv` you'll be prompted for `eventName`, `hdAccount` and `ticketCount`. These values should be the values which you used in `create-tickets`.

```
npm run create-csv

prompt: eventName:  exampleEvent
prompt: hdAccount:  0
prompt: ticketCount:  5
All done. ✅
🚀 exampleEvent.csv written successfully.
```

You can see what is in your .csv file.

```
cat exampleEvent.csv

cashAddress,wif,claimed,value
bitcoincash:qq2fksv6atr0m8aqfl4fngll4y2yxcw2xgqvm65u6m,KzawfwgELP5cE59XUYSPWk5TePwsskZbX4Ym6Zy1X3X7NCbc5env,false,1
bitcoincash:qpupqaefd5hnfg59kx8epxz4jnxkqk7fuc8m0hqcfx,KypHis1HT4YbSPo4ZRsks91rHCHWsiAonpaZnN4v6C669fG2Ri7q,false,1
bitcoincash:qpc08qehc7pydh5e9r5lpglz9nhfpgz6ggayzq8rcz,KwLxpMUyPm93DZ4VV4gqDiQmXAj8Xr2sn7migpSvjESyFziDmkE4,false,1
bitcoincash:qrcyyj3e5y3ml0kmerrsav86l6j8xsmvmce7as0lew,KwY3sh1cagfA7Pm78h6vCZw5DvSaDSq8ZqRNyJKhrwNTPrDgr8Lg,false,5
bitcoincash:qpc8qyn2n994wvm33ectcsfjm53evlfa0cjrmf7df2,KxP2U1fRHxZJMUukzKzcRx5pX1Y5uCReZww7tDh6r7JXDwL7BGje,false,10
```
