import readlineSync from "readline-sync";
import chalk from "chalk";
import { colorQuestion } from "../helpers/colorFormatters";
import { CreateTicketsUserInput, SectionStrings } from "../interfaces";
import fs from "fs-extra";
import path from "path";
import { getLogger } from "log4js";
const logger = getLogger("getUserInput");

/**
 * Gets input from user
 *
 * @param {SectionStrings} strings strings for localization
 * @returns {title: string; language: string;} returns project title and language
 */
const getUserInput = async (
  strings: SectionStrings
): Promise<CreateTicketsUserInput> => {
  try {
    logger.debug("createTickets::getUserInput");
    readlineSync.setDefaultOptions({
      print: display => logger.info(display),
      prompt: chalk.red.bold(": ")
    });

    const { PROMPT_TITLE_DEFAULT, PROMPT_TITLE_DESCRIPTION } = strings;

    // ask user for campaign title
    const titleQuestion = colorQuestion(
      PROMPT_TITLE_DESCRIPTION,
      PROMPT_TITLE_DEFAULT
    );

    const dirs = fs.readdirSync(path.resolve(__dirname, "output"));

    const title = readlineSync.question(titleQuestion, {
      defaultInput: PROMPT_TITLE_DEFAULT,
      limit: directory => {
        const file = path.resolve(__dirname, directory, "wallet.json");
        fs.ensureFileSync(file);

        return false;
      }
    });

    // Open the wallet generated with generate-wallet.
    /* const wallet: Wallet = import(walletPath); */

    const hdAccount = "";
    const ticketCount = 10;

    return { title, hdAccount, ticketCount };
  } catch (error) {
    return error;
  }
};

export default getUserInput;
