import readlineSync from "readline-sync";
import chalk from "chalk";
import { SectionStrings } from "../i18n";
import logger, { colorQuestion } from "../helpers/logger";
import settings from "../settings.json";

export interface UserInput {
  title: string;
  locale: string;
}

/**
 * Gets input from user
 *
 * @param {SectionStrings} strings strings for localization
 * @returns {title: string; language: string;} returns project title and language
 */
const getUserInput = (strings: SectionStrings): UserInput => {
  readlineSync.setDefaultOptions({
    print: display => logger.info(display),
    prompt: chalk.red.bold(": ")
  });

  const {
    PROMPT_LANGUAGE_DESCRIPTION,
    PROMPT_LANGUAGE_MESSAGE,
    PROMPT_TITLE_DEFAULT,
    PROMPT_TITLE_DESCRIPTION
  } = strings;

  const titleQuestion = colorQuestion(
    PROMPT_TITLE_DESCRIPTION,
    PROMPT_TITLE_DEFAULT
  );

  const title = readlineSync.question(titleQuestion, {
    defaultInput: PROMPT_TITLE_DEFAULT
  }); // ask user for campaign title

  const languageQuestion = colorQuestion(
    PROMPT_LANGUAGE_DESCRIPTION,
    settings.defaultLocale
  );
  const locale = readlineSync.question(languageQuestion, {
    defaultInput: settings.defaultLocale,
    limit: Object.keys(settings.languages),
    limitMessage: PROMPT_LANGUAGE_MESSAGE
  }); // ask user for mnemonic language

  return { title, locale };
};

export default getUserInput;
