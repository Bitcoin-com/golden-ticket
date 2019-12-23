import { getLogger } from "log4js";
import generateMnemonic from "../helpers/getMnemonic";
import createMothership from "../helpers/createMothership";
import writeFile from "./writeFile";
import { Mothership, Campaign } from "../interfaces";

import settings from "../settings.json";
import selectCampaign from "../helpers/prompts/selectCampaign";

const logger = getLogger("generateWallet");
/**
 * Generate Wallets
 */
const main = async (): Promise<void> => {
  try {
    logger.debug("generateWallet:main");

    // get input from user
    const campaignData = await selectCampaign();
    if (campaignData === "CANCELED") return;
    const { title }: Campaign = campaignData;

    if (!title) return;
    // genereate a mnemonic
    const mnemonic: string = generateMnemonic();

    // HDNode of first internal change address
    const mothership: Mothership = createMothership(mnemonic, settings.hdpath);

    // prepare for writting wallet to file
    const filename: string = `${settings.outDir}/${title}/wallet.json`;
    const fileData = {
      title,
      mnemonic,
      hdpath: settings.hdpath,
      mothership
    };

    // write file and print results
    await writeFile(filename, fileData);
  } catch (error) {
    throw error;
  }
};

export default main();
