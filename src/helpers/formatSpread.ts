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
): {
  item: string;
  value: string;
  index: string;
}[] => {
  const spreads = Object.keys(spread).reverse();

  const reduced = spreads.reduce(
    (prev, from, index) => {
      const val = spread[from];

      const newRange = range && range.toString() !== from ? range : '?';
      const to = prev[index - 1] ? prev[index - 1].index : newRange;

      const item = ` Tickets: ${Number(from) + 1}-${to} `;
      const value = `Value: ${val || '?'}`;

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
