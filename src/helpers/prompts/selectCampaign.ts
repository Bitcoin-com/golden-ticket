import fs from "fs-extra";
import { getLogger } from "log4js";
import { Campaign, Locale } from "../../interfaces";
import readlineSync from "readline-sync";
import settings from "../../../settings.json";
import path from "path";
import createCampaign from "./createCampaign";
import { colorOutput } from "../colorFormatters";
import getLocales from "../getLocales";

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
    const { ERRORS, SCRIPTS } = getLocales(settings.defaultLocale as Locale);

    if (dirs) {
      const index = readlineSync.keyInSelect(dirs, SCRIPTS.SELECT_CAMPAIGN);
      if (index < 0) return "CANCELED";

      const campaignWallet = `${settings.outDir}/${dirs[index]}/wallet.json`;
      const rawFile = fs.readFileSync(campaignWallet).toString();

      const campaignData = JSON.parse(rawFile);

      return campaignData;
    }

    logger.error(ERRORS.NO_CAMPAIGNS);
    return await createCampaign();
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default selectCampaign;
