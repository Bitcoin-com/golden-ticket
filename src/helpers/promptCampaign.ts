import fs from "fs-extra";
import { Campaign } from "../interfaces";
import readlineSync from "./readlineSync";
import settings from "../settings.json";

/**
 * Prompts user to select campaign from list
 *
 * @param {string} prompt
 * @returns {Promise<Campaign>}
 */
const promptCampaign = async (prompt: string): Promise<Campaign> => {
  const dirs = fs.readdirSync(`${settings.outDir}`);

  const index = readlineSync.keyInSelect(dirs, prompt);
  if (index < 0) throw new Error();

  const campaignWallet = `${settings.outDir}/${dirs[index]}/wallet.json`;
  const rawFile = fs.readFileSync(campaignWallet).toString();

  const campaignData = JSON.parse(rawFile);

  return campaignData;
};

export default promptCampaign;
