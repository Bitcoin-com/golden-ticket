# Fund Tickets

Now you are ready to fund your Golden Tickets. It's best to do this in batches of up to 50 tickets at a time. Also it's best to not mix tiers. For example if you have 10 tickets which you're funding w/ $1 and 5 tickets which you're funding w/ $5 you want to first run `fund-mothership` and send the mothership \$10. Next run `fund-tickets` and fund all 10 tickets w/ \$1. Then you'll want to run `fund-mothership` again and send the mothership $25. Finally you'll run `fund-tickets` again and fund the remaining 5 tickets w/ $5 each.

`fund-tickets` will prompt you for `hdAccount`, `ticketCount` and `iterator`. `hdAccount` and `ticketCount` should be the same that you used in `create-tickets` and `create-csv`.

`iterator` is the golden ticket number which you want to start funding. This is useful if you're funding many tickets over multiple rounds.

For example in `create-tickets` we created 3 $1 tickets, 1 $5 ticket and 1 \$10 ticket. To fund these tickets we would run `fund-mothership` and then `fund-tickets` 3 times.

First we'll fund the \$1 tickets. Note the `iterator` is 0 because we want to start w/ the first ticket. As `fund-tickets` runs it will log the index count, cash address and wif to the console. This is convenient so you can confirm which tickets are getting funded w/ each command.

```
npm run fund-tickets

prompt: hdAccount:  0
prompt: ticketCount:  3
prompt: iterator:  0
0 'bitcoincash:qq2fksv6atr0m8aqfl4fngll4y2yxcw2xgqvm65u6m' 'KzawfwgELP5cE59XUYSPWk5TePwsskZbX4Ym6Zy1X3X7NCbc5env'
1 'bitcoincash:qpupqaefd5hnfg59kx8epxz4jnxkqk7fuc8m0hqcfx' 'KypHis1HT4YbSPo4ZRsks91rHCHWsiAonpaZnN4v6C669fG2Ri7q'
2 'bitcoincash:qpc08qehc7pydh5e9r5lpglz9nhfpgz6ggayzq8rcz' 'KwLxpMUyPm93DZ4VV4gqDiQmXAj8Xr2sn7migpSvjESyFziDmkE4'
Success! TXID:  49ba56bc38878617d63d78675085cb7c18a38b7b00cc82b376ec7d5d6494da27
Check your transaction on the explorer: https://explorer.bitcoin.com/bch/tx/49ba56bc38878617d63d78675085cb7c18a38b7b00cc82b376ec7d5d6494da27
```

Next we run `fund-mothership` and send it \$5. Note the `iterator` is 3 because the index count of the last ticket funded in the previous `fund-tickets` was 2.

```
npm run fund-tickets

prompt: hdAccount:  0
prompt: ticketCount:  1
prompt: iterator:  3
3 'bitcoincash:qrcyyj3e5y3ml0kmerrsav86l6j8xsmvmce7as0lew' 'KwY3sh1cagfA7Pm78h6vCZw5DvSaDSq8ZqRNyJKhrwNTPrDgr8Lg'
Success! TXID:  7eef105725a0e9a00447752b944917a7c4d80f8390fa657897e02e462581fe23
Check your transaction on the explorer: https://explorer.bitcoin.com/bch/tx/7eef105725a0e9a00447752b944917a7c4d80f8390fa657897e02e462581fe23
```

Finally we run `fund-mothership` and send it \$10 to fund the final ticket. Note the `iterator` is 4 because the index count of the last ticket funded in the previous `fund-tickets` was 3.

```
npm run fund-tickets

prompt: hdAccount:  0
prompt: ticketCount:  1
prompt: iterator:  4
4 'bitcoincash:qpc8qyn2n994wvm33ectcsfjm53evlfa0cjrmf7df2' 'KxP2U1fRHxZJMUukzKzcRx5pX1Y5uCReZww7tDh6r7JXDwL7BGje'
Success! TXID:  d75e88534bc04f1ed0bb61bd194375f59926eaf85b2031158dc8619e1fb3d157
Check your transaction on the explorer: https://explorer.bitcoin.com/bch/tx/d75e88534bc04f1ed0bb61bd194375f59926eaf85b2031158dc8619e1fb3d157
```
