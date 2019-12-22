import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import readlineSync, { BasicOptions } from "readline-sync";
import { runScript, getLogger, colorOutput, OutputStyles } from "./helpers";
import { locales } from "./i18n";

import settings from "./settings.json";

import { Logger } from "log4js";

const { SCRIPTS } = locales[settings.defaultLocale];

type ScriptsMap = {
  +readonly [K in keyof typeof SCRIPTS.NAMES]+?: typeof SCRIPTS.NAMES[K];
};

/**
 * Initializes scripts selection and launches selected script
 *
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  try {
    const scripts: ScriptsMap = {
      [SCRIPTS.NAMES.CONFIGURE_CAMPAIGN]: "generateWallet",
      [SCRIPTS.NAMES.CREATE_TICKETS]: "createTickets",
      [SCRIPTS.NAMES.CREATE_CSV]: "createCSV",
      [SCRIPTS.NAMES.FUND_MOTHERSHIP]: "fundMothership",
      [SCRIPTS.NAMES.FUND_TICKETS]: "fundTickets",
      [SCRIPTS.NAMES.CHECK_TICKETS]: "checkTickets",
      [SCRIPTS.NAMES.GENERATE_STATS]: "generateStats",
      [SCRIPTS.NAMES.RECLAIM_FUNDS]: "reclaimFunds"
    };
    const logger: Logger = getLogger("start");

    // display the golden ticket ascii text
    const bannerPath: string = path.resolve(__dirname, "../assets/banner.txt");
    const banner: string = fs.readFileSync(bannerPath).toString();
    logger.info(chalk.yellowBright(banner));

    const scriptKeys: string[] = Object.keys(scripts);

    const readlineOptions: BasicOptions = {
      prompt: {
        toString: (display: any) => {
          console.log("display");
          return display;
        }
      },
      hideEchoBack: false,
      mask: "*",
      limit: [],
      limitMessage: "Input another, please.$<( [)limit(])>",
      defaultInput: "",
      trueValue: [],
      falseValue: [],
      caseSensitive: false,
      keepWhitespace: false,
      encoding: "utf8",
      bufferSize: 1024,
      print: undefined,
      history: true,
      cd: false
    };

    readlineSync.setDefaultOptions(readlineOptions);

    const index = readlineSync.keyInSelect(scriptKeys, SCRIPTS.PROMPT_SCRIPT, {
      cancel: SCRIPTS.EXIT
    });

    if (index !== -1) {
      const script = path.resolve(__dirname, scripts[scriptKeys[index]]);

      logger.info(
        colorOutput({
          item: SCRIPTS.LOG_RUNNING,
          value: scriptKeys[index],
          style: OutputStyles.Start
        })
      );

      runScript(script, [], () => {
        logger.info(
          colorOutput({
            item: SCRIPTS.FINISHED_RUNNING,
            value: scriptKeys[index],
            style: OutputStyles.Complete
          })
        );
        readlineSync.keyInPause(SCRIPTS.CONTINUE);
        init();
      });
    }
  } catch (error) {
    throw error;
  }
};

export default init();
