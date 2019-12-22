import fs from "fs-extra";
import { Campaign } from "../interfaces";
import readlineSync from "./readlineSync";
import settings from "../settings.json";
import { locales } from "../i18n";
/**
 * Prompts user to select campaign from list
 *
 * @param {string} prompt
 * @returns {Promise<Campaign>}
 */
const promptCampaign = async (): Promise<Campaign | "CANCELED"> => {
  try {
    fs.ensureDirSync(settings.outDir);
    const dirs = fs.readdirSync(settings.outDir);
    const { SCRIPTS } = locales[settings.defaultLocale];

    const index = readlineSync.keyInSelect(dirs, SCRIPTS.SELECT_CAMPAIGN);

    if (index < 0) return "CANCELED";

    const campaignWallet = `${settings.outDir}/${dirs[index]}/wallet.json`;
    const rawFile = fs.readFileSync(campaignWallet).toString();

    const campaignData = JSON.parse(rawFile);

    return campaignData;
  } catch (error) {
    throw error;
  }
};

export default promptCampaign;
