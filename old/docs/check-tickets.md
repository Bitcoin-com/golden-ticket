# Check Tickets

After your event you can run `check-tickets` to check the remaining balance of each of your tickets. This will give you a sense of how many people swept the tickets to their personal wallet.

As `check-tickets` runs it will log the index count, cash address, wif and `'true'` if the ticket has been claimed and `'false'` if it hasn't. After `check-tickets` is done it will create a new .csv w/ `-final.csv` in the name.

Similar to `create-csv` you'll want to edit `check-tickets.ts` and add in your tiers. Make sure to run `npm run build` after editing `check-tickets.ts`.

```js
let value: number = 1
if (i <= 2) value = 1
else if (i === 3) value = 5
else if (i === 4) value = 10
```

Now run `check-tickets` to see which tickets have been claimed. Imagine that 1 of our $1 tickets and our single $5 ticket had been claimed at our event.

```
npm run check-tickets

prompt: eventName: exampleEvent
prompt: hdAccount: 0
prompt: ticketCount: 5
0 'bitcoincash:qq2fksv6atr0m8aqfl4fngll4y2yxcw2xgqvm65u6m' 'KzawfwgELP5cE59XUYSPWk5TePwsskZbX4Ym6Zy1X3X7NCbc5env' 1 'false'
1 'bitcoincash:qpupqaefd5hnfg59kx8epxz4jnxkqk7fuc8m0hqcfx' 'KypHis1HT4YbSPo4ZRsks91rHCHWsiAonpaZnN4v6C669fG2Ri7q' 1 'true'
2 'bitcoincash:qpc08qehc7pydh5e9r5lpglz9nhfpgz6ggayzq8rcz' 'KwLxpMUyPm93DZ4VV4gqDiQmXAj8Xr2sn7migpSvjESyFziDmkE4' 1 'false'
3 'bitcoincash:qrcyyj3e5y3ml0kmerrsav86l6j8xsmvmce7as0lew' 'KwY3sh1cagfA7Pm78h6vCZw5DvSaDSq8ZqRNyJKhrwNTPrDgr8Lg' 5 'true'
4 'bitcoincash:qpc8qyn2n994wvm33ectcsfjm53evlfa0cjrmf7df2' 'KxP2U1fRHxZJMUukzKzcRx5pX1Y5uCReZww7tDh6r7JXDwL7BGje' 10 'false'
exampleEvent-final.csv written successfully.
```

You can example the contexts of your `${eventName}-final.csv` file.

```
cat exampleEvent-final.csv
cashAddress,wif,claimed,value
bitcoincash:qq2fksv6atr0m8aqfl4fngll4y2yxcw2xgqvm65u6m,KzawfwgELP5cE59XUYSPWk5TePwsskZbX4Ym6Zy1X3X7NCbc5env,false,1
bitcoincash:qpupqaefd5hnfg59kx8epxz4jnxkqk7fuc8m0hqcfx,KypHis1HT4YbSPo4ZRsks91rHCHWsiAonpaZnN4v6C669fG2Ri7q,true,1
bitcoincash:qpc08qehc7pydh5e9r5lpglz9nhfpgz6ggayzq8rcz,KwLxpMUyPm93DZ4VV4gqDiQmXAj8Xr2sn7migpSvjESyFziDmkE4,false,1
bitcoincash:qrcyyj3e5y3ml0kmerrsav86l6j8xsmvmce7as0lew,KwY3sh1cagfA7Pm78h6vCZw5DvSaDSq8ZqRNyJKhrwNTPrDgr8Lg,true,5
bitcoincash:qpc8qyn2n994wvm33ectcsfjm53evlfa0cjrmf7df2,KxP2U1fRHxZJMUukzKzcRx5pX1Y5uCReZww7tDh6r7JXDwL7BGje,false,10
```
