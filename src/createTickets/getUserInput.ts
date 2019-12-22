import chalk from "chalk";
import { Campaign, Config } from "../interfaces";
import {
  colorQuestion,
  generateConfig,
  getLogger,
  readlineSync,
  promptCampaign
} from "../helpers";
import settings from "../settings.json";

const logger = getLogger("getUserInput");

/**
 * Gets user input for create tickets
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

    const { PROMPT_TITLE_DESCRIPTION, PROMPT_COUNT_DESCRIPTION } = strings;

    const campaignData = await promptCampaign(PROMPT_TITLE_DESCRIPTION);

    const ticketCount = readlineSync.questionInt(
      colorQuestion(
        PROMPT_COUNT_DESCRIPTION,
        settings.defaultTickets.toString()
      ),
      {
        defaultInput: settings.defaultTickets.toString()
      }
    );

    return { ...campaignData, ticketCount };
  } catch (error) {
    logger.error(error.message);
    return error;
  }
};

export default getUserInput;
