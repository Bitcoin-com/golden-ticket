import path from "path";
import childProcess from "child_process";
import readlineSync from "readline-sync";
import chalk from "chalk";

import { locales } from "./i18n";
import logger, { colorDisplay } from "./helpers/logger";

import { Locale } from "./interfaces";

readlineSync.setDefaultOptions({
  print: display => logger.info(colorDisplay(display))
});

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

const runScript = (
  modulePath: string,
  args: string[],
  callback: (props?: object | Error | null) => void
): void => {
  const process = childProcess.fork(modulePath, args);
  let invoked = false;

  process.on("error", err => {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  process.on("exit", code => {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error("Exit code " + code);
    callback(err);
  });
};

interface ArgumentsMap {
  locale: Locale;
  debug?: string;
}

/**
 * Initializes scripts selection and launches selected script
 *
 * @returns {void}
 */
const init = (): void => {
  try {
    const { argv } = process;

    if (argv.includes("--debug")) logger.level = "debug";

    const argsMap: ArgumentsMap = argv.reduce(
      (p, c, i) =>
        c.startsWith("--") ? { ...p, [c.substr(2)]: argv[i + 1] } : p,
      { locale: "en" }
    );
    const { locale = "en" } = argsMap;

    const { SCRIPTS } = locales[locale];

    const scriptKeys = Object.keys(scripts);

    const index = readlineSync.keyInSelect(scriptKeys, SCRIPTS.PROMPT_SCRIPT);

    if (index !== -1) {
      const script = path.resolve(__dirname, scripts[scriptKeys[index]]);

      logger.info(SCRIPTS.LOG_RUNNING, chalk.green(scriptKeys[index]));

      runScript(script, [locale], err => {
        if (err) return logger.error(err);
        return logger.info("Finished running", scriptKeys[index]);
      });
    }
  } catch (error) {
    return logger.error(error);
  }
};

init();
