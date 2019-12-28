import { BitcoinCash } from 'bitbox-sdk';

/**
 * Formats spread for logger
 *
 * @param {{ [any: string]: number }} spread
 * @param {number} range
 * @returns {{
 *   item: string;
 *   value: string;
 *   index: string;
 * }[]}
 */
const formatSpread = (
  spread: { [any: string]: number },
  range?: number,
  adjustment?: number,
): {
  item: string;
  value: string;
  index: string;
}[] => {
  const spreadKeys = Object.keys(spread).reverse();

  const reduced = spreadKeys.reduce(
    (prev, from, index) => {
      const val = spread[from];

      const newRange = range && range.toString() !== from ? range : '?';
      const to = prev[index - 1] ? prev[index - 1].index : newRange;

      const bitcoinCash = new BitcoinCash();
      const item = `Tickets: ${Number(from) + 1}-${to}`;
      const value = `Value: ${
        adjustment
          ? `${bitcoinCash.toBitcoinCash(adjustment * val)} BCH`
          : val || '?'
      }`;

      return [
        ...prev,
        {
          item,
          value,
          index: from,
        },
      ];
    },
    [] as {
      item: string;
      value: string;
      index: string;
    }[],
  );

  return reduced.reverse();
};

export default formatSpread;
