# Generate Stats

`generate-stats` lets you create some human readable stats which you can share w/ your team. It generates these stats based on the `${eventName}-final.csv` which was created in the previous `check-tickets` step.

You'll need to edit `generate-stats.ts` to include information about your ticket's tiers.

```
npm run generate-stats

prompt: eventName:  exampleEvent
Ticket count: Total 5, claimed 2, unclaimed 3
$1 breakdown: Total 3, claimed 1, unclaimed 2
$5 breakdown: Total 1, claimed 1, unclaimed 0
$10 breakdown: Total 1, claimed 0, unclaimed 1
Funds claimed: Total: $18, claimed $6, unclaimed $12
```
