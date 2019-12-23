import toRegexRange from 'to-regex-range';

/**
 * Returns a tiered value
 *
 * @param {number} number
 * @param {{ [key: string]: number }} ticketSpread
 * @returns {number}
 */
const getTieredValue = (
  number: number,
  ticketSpread: { [key: string]: number },
): number => {
  const tiers = Object.keys(ticketSpread);
  let value = 1;

  tiers.forEach(tier => {
    const [from, to] = tier.split('-');
    const regex = toRegexRange(from, to);

    value = RegExp(`^${regex}$`).test(number.toString())
      ? ticketSpread[tier]
      : value;
  });
  return value;
};

export default getTieredValue;
