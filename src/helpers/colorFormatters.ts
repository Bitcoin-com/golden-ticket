import chalk from "chalk";
import emoji from "node-emoji";

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
  extra?: { highlight?: boolean }
): string => {
  const { highlight } = extra || {};

  const strings = [
    chalk.green(item),
    highlight
      ? chalk.bold(chalk.bgYellow(chalk.black(` === ${value} === `)))
      : chalk.cyan(value)
  ];

  return strings.join(" ");
};

/**
 * Colurs number display
 *
 * @param {string} display
 * @returns {string}
 */
export const colorDisplay = (display: string): string =>
  display.replace(/\W\d\W/g, (x: string) => chalk.green(x));
