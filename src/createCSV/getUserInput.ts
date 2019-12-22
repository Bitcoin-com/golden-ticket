import chalk from "chalk";
import { Campaign, Config } from "../interfaces";
import {
  promptCampaign,
  generateConfig,
  getLogger,
  readlineSync
} from "../helpers";

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

    return await promptCampaign(strings.PROMPT_TITLE_DESCRIPTION);
  } catch (error) {
    logger.error(error.message);
    return error;
  }
};

export default getUserInput;
