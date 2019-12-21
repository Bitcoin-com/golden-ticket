import readlineSync from "../helpers/readlineSync";
import chalk from "chalk";
import { getLogger } from "log4js";
import { colorQuestion } from "../helpers/colorFormatters";
import { GenerateWalletUserInput, SectionStrings } from "../interfaces";

const logger = getLogger("getUserInput");
/**
 * Gets input from user
 *
 * @param {SectionStrings} strings strings for localization
 * @returns {title: string; language: string;} returns project title and language
 */
const getUserInput = (strings: SectionStrings): GenerateWalletUserInput => {
  logger.debug("generateWallet::getUserInput");
  readlineSync.setDefaultOptions({
    print: display => logger.info(display),
    prompt: chalk.red.bold(": ")
  });

  const { PROMPT_TITLE_DEFAULT, PROMPT_TITLE_DESCRIPTION } = strings;

  const titleQuestion = colorQuestion(
    PROMPT_TITLE_DESCRIPTION,
    PROMPT_TITLE_DEFAULT
  );

  const title = readlineSync.question(titleQuestion, {
    defaultInput: PROMPT_TITLE_DEFAULT
  }); // ask user for campaign title

  return { title };
};

export default getUserInput;
