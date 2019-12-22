import {
  getLogger,
  colorOutput,
  OutputStyles,
  createObject,
  promptCampaign,
  getCampaignWIFs
} from "../helpers";
import writeCSV from "./writeCSV";
import settings from "../settings.json";
import { locales } from "../i18n";
/**
 * Open the wallet generated with generate-wallet.
 *
 * @returns {Promise<any>}
 */
const main: any = async (): Promise<any> => {
  try {
    const strings = locales[settings.defaultLocale];

    const logger = getLogger("createCSV");
    const campaignData = await promptCampaign();
    if (campaignData === "CANCELED") return;

    const wifs = await getCampaignWIFs(campaignData.title);
    const addresses = await createObject(wifs);
    const filename = `${settings.outDir}/${campaignData.title}/addresses.csv`;

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_CSV,
        value: campaignData.title,
        style: OutputStyles.Start
      })
    );

    await writeCSV(filename, addresses);

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_CSV_COMPLETE,
        value: filename,
        style: OutputStyles.Complete
      }),
      "\n============================================================"
    );
  } catch (error) {
    return error;
  }
};

export default main();
