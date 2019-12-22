import path from "path";
import fs from "fs-extra";
import getLogger from "./helpers/logger";

import { ArgumentsMap } from "./interfaces";
import readlineSync from "./helpers/readlineSync";
import { locales } from "./i18n";

import runScript from "./helpers/runScript";
import { colorOutput } from "./helpers/colorFormatters";
import chalk from "chalk";

const logger = getLogger("start");

const scripts = {
  "Generate Wallet": "generateWallet",
  "Create Tickets": "createTickets",
  "Create CSV": "create-csv.js",
  "Fund Mothership": "fund-mothership.js",
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

    const index = readlineSync.keyInSelect(scriptKeys, SCRIPTS.PROMPT_SCRIPT, {
      hideEchoBack: true,

      defaultInput: "0",
      cancel: "EXIT"
    });

    if (index !== -1) {
      const script = path.resolve(__dirname, scripts[scriptKeys[index]]);

      logger.info(colorOutput(SCRIPTS.LOG_RUNNING, scriptKeys[index]));

      runScript(script, [locale], () => {
        if (
          readlineSync.keyInYN("Return to menu?", {
            caseSensitive: false,
            trueValue: ["y", "yes", "yeah", "yep"],
            falseValue: ["n", "no", "nah", "nope"],
            defaultInput: "y"
          })
        ) {
          init();
        } else {
          logger.info(colorOutput(SCRIPTS.FINISHED_RUNNING, scriptKeys[index]));
        }
      });
    }
  } catch (error) {
    return logger.error(error);
  }
};

export default init();
