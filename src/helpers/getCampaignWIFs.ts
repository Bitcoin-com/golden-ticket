import fs from "fs-extra";
import settings from "../../settings.json";

/**
 * Get list of WIFs used in campaign
 *
 * @param {string} title campaign title
 * @returns {string[]}
 */
const getCampaignWIFs = async (title: string): Promise<string[]> => {
  try {
    const wifs = fs.readFileSync(
      `${settings.outDir}/${title}/privKeyWIFs`,
      "utf8"
    );
    const wifsArray = wifs.toString().split("\n");
    return wifsArray;
  } catch (error) {
    return error;
  }
};

export default getCampaignWIFs;
