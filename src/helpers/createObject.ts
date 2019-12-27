import { getLogger } from 'log4js';
import { colorOutput } from './colorFormatters';
import sleep from './sleep';
import getCashAddress from './getCashAddress';
import getTieredValue from './getTieredValue';
import settings from '../../settings.json';

/**
 * Creates CSV object from array of wifs
 *
 * @param {string[]} wifs
 * @returns {Promise<CSV[]>}
 */
const createObject = async (wifs: string[]): Promise<CSV[]> => {
  const logger = getLogger('createCSV');

  const addresses = await Promise.all(
    wifs.map(async (wif, i) => {
      await sleep(settings.timer);

      const claimed = false;
      const cashAddress = getCashAddress(wif);
      const value = getTieredValue(i, {});

      const obj: CSV = {
        cashAddress,
        wif,
        claimed,
        value,
      };

      logger.info(
        colorOutput({
          item: `${cashAddress} value:`,
          value: value.toString(),
        }),
      );

      return obj;
    }),
  );

  return addresses;
};

export default createObject;
