import chalk from "chalk";
import fs from "fs-extra";
import { Campaign, Config } from "../interfaces";
import { generateConfig, getLogger, readlineSync } from "../helpers";
import settings from "../settings.json";

const logger = getLogger("getUserInput");

/**
 * Gets user input for create csv
 *
 * @returns {Promise<Campaign>}
 */
const getUserInput = async (): Promise<Campaign> => {
  try {
    logger.debug("createTickets::getUserInput");
    readlineSync.setDefaultOptions({
      print: display => logger.info(display),
      prompt: chalk.red.bold(": ")
    });
    const { strings }: Config = generateConfig("CREATE_TICKETS");

    // ask user for campaign title
    const dirs = fs.readdirSync(`${settings.outDir}`);

    const index = readlineSync.keyInSelect(
      dirs,
      strings.PROMPT_TITLE_DESCRIPTION
    );
    if (index < 0) throw new Error();

    const campaignWallet = `${settings.outDir}/${dirs[index]}/wallet.json`;
    const rawFile = fs.readFileSync(campaignWallet).toString();

    const campaignData = JSON.parse(rawFile);

    return campaignData;
  } catch (error) {
    logger.error(error.message);
    return error;
  }
};

export default getUserInput;
