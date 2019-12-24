import chalk from 'chalk';
import { emoji } from 'node-emoji';

/**
 * Colors and formats a question and default answer
 *
 * @param {string} question
 * @param {string} defaultAnswer
 * @returns {string} Formatted question - `question [defaultAnswer]`
 */
export const colorQuestion = (
  question: string,
  defaultAnswer: string,
): string => {
  return [question, chalk.blackBright(` [${defaultAnswer}]`), ': '].join('');
};

export enum OutputStyles {
  Highlight = 'highlight',
  Waiting = 'waiting',
  Complete = 'complete',
  Start = 'start',
  Error = 'error',
  Default = 'default',
  Information = 'information',
  Question = 'question',
}

/**
 * Colors and formats information
 *
 * @param {string} item
 * @param {string} value
 * @param {{ highlight?: boolean; emoji?: Emoji }} [extra]
 * @returns {string}
 */
export const colorOutput = ({
  item,
  value = '',
  style = OutputStyles.Default,
}: {
  item: string;
  value?: string;
  style?:
    | 'highlight'
    | 'complete'
    | 'error'
    | 'waiting'
    | 'default'
    | 'start'
    | 'information'
    | 'question';
}): string => {
  switch (style) {
    case OutputStyles.Question: {
      const strings = [
        emoji.grey_question,
        '',
        chalk.yellow(item),
        chalk.cyan(value),
      ];
      return strings.join(' ');
    }
    case OutputStyles.Information: {
      const strings = [
        emoji.grey_question,
        '',
        chalk.cyan(item),
        value ? chalk.bgWhite(chalk.black(` ${value} `)) : '',
      ];
      return strings.join(' ');
    }
    case OutputStyles.Waiting: {
      const strings = [
        emoji.hourglass_flowing_sand,
        '',
        chalk.cyanBright(item),
        chalk.green(value),
      ];
      return strings.join(' ');
    }
    case OutputStyles.Start: {
      const strings = [
        emoji.hourglass_flowing_sand,
        '',
        chalk.cyanBright(item),
        chalk.white(value),
      ];
      return strings.join(' ');
    }
    case OutputStyles.Complete: {
      const strings = [
        emoji.heavy_check_mark,
        '',
        chalk.cyanBright(item),
        chalk.white(value),
      ];
      return strings.join(' ');
    }
    case OutputStyles.Highlight: {
      const strings = [
        chalk.green(item),
        chalk.bgYellowBright(chalk.black(` === ${value} === `)),
      ];
      return strings.join(' ');
    }
    default: {
      const strings = [chalk.green(item), chalk.cyan(value)];
      return strings.join(' ');
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
