import {
  getLogger,
  colorOutput,
  generateConfig,
  OutputStyles,
  createObject,
  promptCampaign,
  getCampaignWIFs
} from "../helpers";
import writeCSV from "./writeCSV";
import settings from "../settings.json";

/**
 * Open the wallet generated with generate-wallet.
 *
 * @returns {Promise<any>}
 */
const main: any = async (): Promise<any> => {
  try {
    const { strings } = generateConfig("CREATE_CSV");
    const logger = getLogger("createCSV");
    const { title } = await promptCampaign(strings.PROMPT_TITLE_DESCRIPTION);
    const wifs = await getCampaignWIFs(title);
    const addresses = await createObject(wifs);
    const filename = `${settings.outDir}/${title}/addresses.csv`;

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_CSV,
        value: title,
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
