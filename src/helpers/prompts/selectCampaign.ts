import fs from "fs-extra";
import { getLogger } from "log4js";
import { Campaign } from "../../interfaces";
import readlineSync from "readline-sync";
import settings from "../../settings.json";
import { locales } from "../../i18n";
import path from "path";
import createCampaign from "./createCampaign";

const logger = getLogger("promptCampaign");

/**
 * Prompts user to select campaign from list
 *
 * @param {string} prompt
 * @returns {Promise<Campaign>}
 */
const selectCampaign = async (): Promise<Campaign | "CANCELED"> => {
  try {
    fs.ensureDirSync(settings.outDir);
    const dirs = fs.readdirSync(path.resolve(settings.outDir));
    logger.debug("promptCampaign:path", path.resolve(settings.outDir));
    logger.debug("promptCampaign:dirs", dirs);
    const { SCRIPTS } = locales[settings.defaultLocale];

    if (dirs.length !== -1) {
      const index = readlineSync.keyInSelect(dirs, SCRIPTS.SELECT_CAMPAIGN);

      if (index < 0) return "CANCELED";

      const campaignWallet = `${settings.outDir}/${dirs[index]}/wallet.json`;
      const rawFile = fs.readFileSync(campaignWallet).toString();

      const campaignData = JSON.parse(rawFile);

      return campaignData;
    }

    return await createCampaign();
  } catch (error) {
    throw error;
  }
};

export default selectCampaign;
