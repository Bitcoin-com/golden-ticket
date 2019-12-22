import chalk from "chalk";
import { emoji } from "node-emoji";

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

export enum OutputStyles {
  Highlight = "highlight",
  Complete = "complete",
  Start = "start",
  Error = "error",
  Default = "default"
}

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
  style:
    | "highlight"
    | "complete"
    | "error"
    | "default"
    | "start" = OutputStyles.Default
): string => {
  switch (style) {
    case OutputStyles.Start: {
      const strings = [
        emoji.heavy_check_mark,
        "",
        chalk.white(item),
        chalk.green(value)
      ];
      return strings.join(" ");
    }
    case OutputStyles.Complete: {
      const strings = [
        emoji.heavy_check_mark,
        "",
        chalk.cyan(item),
        chalk.white(value)
      ];
      return strings.join(" ");
    }
    case OutputStyles.Highlight: {
      const strings = [
        chalk.green(item),
        chalk.bgYellowBright(chalk.black(` === ${value} === `))
      ];
      return strings.join(" ");
    }
    default: {
      const strings = [chalk.green(item), chalk.cyan(value)];
      return strings.join(" ");
    }
  }
};

/**
 * Colurs number display
 *
 * @param {string} display
 * @returns {string}
 */
export const colorDisplay = (display: string): string =>
  display.replace(/\W\d\W/g, (x: string) => chalk.green(x));
