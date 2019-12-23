import { getLogger } from "log4js";
import { CSV } from "../interfaces";
import { sleep, getCashAddress, colorOutput, getTieredValue } from "../helpers";
import settings from "../../settings.json";

/**
 * Creates CSV object from array of wifs
 *
 * @param {string[]} wifs
 * @returns {Promise<CSV[]>}
 */
const createObject = async (wifs: string[]): Promise<CSV[]> => {
  const logger = getLogger("createCSV");

  const addresses = await Promise.all(
    wifs.map(async (wif, i) => {
      await sleep(settings.timer);

      const claimed = false;
      const cashAddress = getCashAddress(wif);
      const value = getTieredValue(i, settings.ticketSpread);

      const obj: CSV = { cashAddress, wif, claimed, value };

      logger.info(
        colorOutput({
          item: `${cashAddress} value:`,
          value: value.toString()
        })
      );

      return obj;
    })
  );

  return addresses;
};

export default createObject;
