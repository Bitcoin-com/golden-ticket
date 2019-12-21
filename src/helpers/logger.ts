import { getLogger, configure } from "log4js";
import chalk from "chalk";

const logger = getLogger("GoldenTicket");
logger.level = "debug";

configure({
  appenders: {
    access: {
      type: "dateFile",
      filename: "log/access.log",
      pattern: "-yyyy-MM-dd",
      category: "http"
    },
    app: {
      type: "file",
      filename: "log/app.log",
      maxLogSize: 10485760,
      numBackups: 3
    },
    errorFile: {
      type: "file",
      filename: "log/errors.log"
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile"
    }
  },
  categories: {
    default: { appenders: ["app", "errors"], level: "DEBUG" },
    http: { appenders: ["access"], level: "DEBUG" }
  }
});

/**
 * Colors and formats a question and default answer
 *
 * @param {string} question
 * @param {string} defaultAnswer
 * @returns {string} Formatted question - `question [defaultAnswer]`
 */
export const colorQuestion = (
  question: string,
  defaultAnswer: string
): string => {
  return [question, chalk.blackBright(` [${defaultAnswer}]`), ": "].join("");
};

/**
 * Colors and formats information
 *
 * @param {string} item
 * @param {string} value
 * @param {{ highlight?: boolean; emoji?: Emoji }} [extra]
 * @returns {string}
 */
export const colorOutput = (
  item: string,
  value: string,
  extra?: { highlight?: boolean; emoji?: string }
): string => {
  const { highlight, emoji } = extra || {};

  const strings = [
    chalk.green(item),
    highlight ? chalk.bgWhite(chalk.yellow(value)) : chalk.cyan(value)
  ];

  if (emoji) return [emoji, ...strings].join(" ");

  return strings.join(" ");
};

export default logger;
