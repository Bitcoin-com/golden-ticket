import fs from "fs-extra";
import { CSV } from "../interfaces";
import {
  getLogger,
  sleep,
  colorOutput,
  generateConfig,
  getCashAddress,
  OutputStyles
} from "../helpers";
import settings from "../settings.json";
import getUserInput from "./getUserInput";
import getTieredValue from "./getTieredValue";
import writeCSV from "./writeCSV";

/**
 * Open the wallet generated with generate-wallet.
 *
 * @returns {Promise<any>}
 */
const main: any = async (): Promise<any> => {
  try {
    const campaignData = await getUserInput();

    const logger = getLogger("createCSV");
    const { strings } = generateConfig("CREATE_CSV");
    const { title } = campaignData;
    const filename = `${settings.outDir}/${title}/addresses.csv`;
    const addresses = [];

    const wifs = fs
      .readFileSync(`${settings.outDir}/${title}/privKeyWIFs`, "utf8")
      .toString()
      .split("\n");

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_CSV,
        value: title,
        style: OutputStyles.Start
      })
    );

    for (const i in wifs) {
      await sleep(settings.timer);
      const obj: CSV = {
        cashAddress: getCashAddress(wifs[i]),
        wif: wifs[i],
        claimed: false,
        value: getTieredValue(Number(i), settings.ticketSpread)
      };

      addresses.push(obj);
      logger.info(
        colorOutput({
          item: `${obj.cashAddress} value:`,
          value: `${obj.value}`
        })
      );
    }

    await writeCSV(filename, addresses);

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_CSV_COMPLETE,
        value: filename,
        style: OutputStyles.Complete
      })
    );
    logger.info("============================================================");
  } catch (error) {
    return error;
  }
};

export default main();
