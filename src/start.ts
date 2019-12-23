import childProcess from 'child_process';
import { getLogger, configure } from 'log4js';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { colorOutput, OutputStyles } from './helpers';
import { getLocales } from './i18n';
import settings from '../settings.json';
import banner from '../assets/banner.txt';
import { Locale } from './interfaces';
import loggerConfig from './helpers/loggerConfig';

const logger = getLogger('start');
configure(loggerConfig);

const { SCRIPTS } = getLocales(settings.defaultLocale as Locale);

type ScriptsMap = {
  +readonly [K in keyof typeof SCRIPTS.NAMES]+?: typeof SCRIPTS.NAMES[K];
};

const showBanner = (): void => {
  // display the golden ticket ascii text
  const bannerString: string = fs
    .readFileSync(path.resolve('dist', banner))
    .toString();
  logger.info(chalk.yellowBright(bannerString));
};

/**
 * Runs a node child proccess with chosen script
 *
 * @param {string} modulePath
 * @param {string[]} args
 * @param {((props?: object | Error | null) => void)} callback
 */
const runScript = (
  modulePath: string,
  args: string[],
  callback: (props?: object | Error | null) => void,
): void => {
  const process = childProcess.fork(modulePath, args);
  let invoked = false;

  process.on('error', err => {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  process.on('exit', code => {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error(`Exit code ${code}`);
    callback(err);
  });
};

/**
 * Initializes scripts selection and launches selected script
 *
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  try {
    logger.debug('start:init');
    showBanner();

    const scripts: ScriptsMap = {
      [SCRIPTS.NAMES.CONFIGURE_CAMPAIGN]: 'configureCampaign',
      [SCRIPTS.NAMES.CREATE_TICKETS]: 'createTickets',
      [SCRIPTS.NAMES.CREATE_CSV]: 'createCSV',
      [SCRIPTS.NAMES.FUND_MOTHERSHIP]: 'fundMothership',
      [SCRIPTS.NAMES.FUND_TICKETS]: 'fundTickets',
      [SCRIPTS.NAMES.CHECK_TICKETS]: 'checkTickets',
      [SCRIPTS.NAMES.GENERATE_STATS]: 'generateStats',
      [SCRIPTS.NAMES.RECLAIM_FUNDS]: 'reclaimFunds',
    };

    const scriptKeys: string[] = Object.keys(scripts);

    const index = readlineSync.keyInSelect(
      scriptKeys.map(key => chalk.cyan(key)),
      SCRIPTS.PROMPT_SCRIPT,
      { cancel: chalk.red(SCRIPTS.EXIT) },
    );

    if (index !== -1) {
      const script = path.resolve('dist', scripts[scriptKeys[index]]);

      logger.info(
        colorOutput({
          item: SCRIPTS.LOG_RUNNING,
          value: scriptKeys[index],
          style: OutputStyles.Start,
        }),
      );

      runScript(script, [], () => {
        logger.info(
          colorOutput({
            item: SCRIPTS.FINISHED_RUNNING,
            value: scriptKeys[index],
            style: OutputStyles.Complete,
          }),
        );
        readlineSync.keyInPause(SCRIPTS.CONTINUE);
        init();
      });
    }
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default init();