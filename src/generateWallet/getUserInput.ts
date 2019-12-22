import readlineSync from "readline-sync";
import { colorQuestion, getLogger, promptCampaign } from "../helpers";
import settings from "../settings.json";
import { locales } from "../i18n";

/**
 * Gets input from user
 *
 * @param {SectionStrings} strings strings for localization
 * @returns {title: string; language: string;} returns project title and language
 */
const getUserInput = async (): Promise<{
  title: string;
  ticketCount: number;
}> => {
  try {
    const logger = getLogger("generateWallet");
    const strings = locales[settings.defaultLocale];
    const campaigns = await promptCampaign();
    if (campaigns) {
      console.log(campaigns);
    }
    const title = readlineSync.question(
      colorQuestion(
        strings.GENERATE_WALLETS.PROMPT_TITLE_DESCRIPTION,
        strings.GENERATE_WALLETS.PROMPT_TITLE_DEFAULT
      ),
      {
        defaultInput: strings.GENERATE_WALLETS.PROMPT_TITLE_DEFAULT,
        limit: t => {
          console.log(t);
          return true;
        },
        limitMessage: strings.GENERATE_WALLETS.PROMPT_TITLE_LIMIT_MESSAGE
      }
    );

    const ticketCount = readlineSync.questionInt(
      colorQuestion(
        strings.CREATE_TICKETS.PROMPT_COUNT_DESCRIPTION,
        settings.defaultTickets.toString()
      ),
      {
        defaultInput: settings.defaultTickets.toString()
      }
    );

    return { title, ticketCount };
  } catch (error) {
    throw error;
  }
};

export default getUserInput;
