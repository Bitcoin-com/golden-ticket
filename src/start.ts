import path from "path";
import fs from "fs-extra";
import { ArgumentsMap } from "./interfaces";
import {
  runScript,
  readlineSync,
  getLogger,
  colorOutput,
  OutputStyles
} from "./helpers";
import { locales } from "./i18n";

import chalk from "chalk";

const logger = getLogger("start");

const scripts = {
  "Generate Wallet": "generateWallet",
  "Create Tickets": "createTickets",
  "Create CSV": "createCSV",
  "Fund Mothership": "fundMothership",
  "Fund Tickets": "fund-tickets.js",
  "Check Tickets": "check-tickets.js",
  "Generate Stats": "generate-stats.js",
  "Reclaim Funds": "reclaim-funds.js"
};

// need a script to export static assets to dist directory
const startBanner = chalk.yellowBright(
  fs
    .readFileSync(path.resolve(__dirname, "../src/assets/banner.txt"))
    .toString()
);

/**
 * Initializes scripts selection and launches selected script
 *
 * @returns {void}
 */
const init = (): void => {
  try {
    const { argv } = process;
    const argsMap: ArgumentsMap = argv.reduce(
      (p, c, i) =>
        c.startsWith("--") ? { ...p, [c.substr(2)]: argv[i + 1] } : p,
      { locale: "en" }
    );
    const { locale = "en" } = argsMap;
    const { SCRIPTS } = locales[locale];
    const scriptKeys = Object.keys(scripts);

    logger.info(startBanner);
    readlineSync.setDefaultOptions({
      hideEchoBack: true
    });
    const index = readlineSync.keyInSelect(scriptKeys, SCRIPTS.PROMPT_SCRIPT, {
      hideEchoBack: true,
      defaultInput: "0",
      cancel: "EXIT"
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

      runScript(script, [locale], () => {
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
    return logger.error(error);
  }
};

export default init();
