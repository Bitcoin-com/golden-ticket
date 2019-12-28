import chalk from 'chalk';
import { emoji } from 'node-emoji';

export enum OutputStyles {
  Highlight = 'highlight',
  Waiting = 'waiting',
  Complete = 'complete',
  Start = 'start',
  Error = 'error',
  Default = 'default',
  Information = 'information',
  Question = 'question',
  Title = 'title',
  Warning = 'warning',
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
  lineabreak = false,
}: {
  item: string;
  value?: string | number;
  lineabreak?: boolean;
  style?:
    | 'highlight'
    | 'complete'
    | 'error'
    | 'waiting'
    | 'default'
    | 'start'
    | 'information'
    | 'title'
    | 'warning'
    | 'question';
}): string => {
  switch (style) {
    case OutputStyles.Warning:
      return chalk.bgRed(chalk.white(` ${item} `));
    case OutputStyles.Question: {
      const q = chalk.magentaBright(item);
      const a = value ? chalk.white(`[${value}]: `) : '';
      return `${q} ${a}`;
    }
    case OutputStyles.Information: {
      const strings = [
        chalk.bgCyanBright(chalk.black(` ${item} `)),
        value ? chalk.bgCyanBright(chalk.black(` ${value} `)) : '',
      ].join(' ');
      return lineabreak ? `${strings}\n` : strings;
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
    case OutputStyles.Title: {
      // eslint-disable-next-line no-console
      console.clear();
      const string = chalk.bgYellowBright(chalk.black(` === ${item} === `));
      return lineabreak ? `${string}\n` : string;
    }
    case OutputStyles.Highlight: {
      const strings = [
        chalk.green(item),
        chalk.bgYellowBright(chalk.black(` === ${value} === `)),
      ];
      return strings.join(' ');
    }
    default:
      return `${chalk.whiteBright(item)}: ${chalk.cyan(value)}${
        lineabreak ? '\n' : ''
      }`;
  }
};
