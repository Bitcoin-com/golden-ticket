// import ajv from 'ajv';
import { configure, getLogger } from 'log4js';
import chalk from 'chalk';
import childProcess from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import readlineSync from 'readline-sync';
import { OutputStyles, colorOutput } from './helpers/colorFormatters';

import { getLocales } from './i18n';
import loggerConfig from './helpers/loggerConfig';
import banner from './assets/banner.txt';
import goodbye from './assets/goodbye.txt';
import getSettings from './getSettings';

const logger = getLogger();
configure(loggerConfig);
const settings = getSettings();

const showBanner = (end?: boolean): void => {
  // display the golden ticket ascii text
  const bannerString: string = fs
    .readFileSync(path.resolve('dist', end ? goodbye : banner))
    .toString();

  // eslint-disable-next-line no-console
  console.clear();

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
const init = (): void => {
  const { SCRIPTS } = getLocales(settings.locale);

  const scripts: { [any: string]: string } = {
    [SCRIPTS.NAMES.CONFIGURE_CAMPAIGN]: 'configureCampaign',
    [SCRIPTS.NAMES.CREATE_TICKETS]: 'createTickets',
    [SCRIPTS.NAMES.CREATE_CSV]: 'createCSV',
    [SCRIPTS.NAMES.FUND_MOTHERSHIP]: 'fundMothership',
    [SCRIPTS.NAMES.FUND_TICKETS]: 'fundTickets',
    [SCRIPTS.NAMES.CHECK_TICKETS]: 'checkTickets',
    [SCRIPTS.NAMES.GENERATE_STATS]: 'generateStats',
    [SCRIPTS.NAMES.RECLAIM_FUNDS]: 'reclaimFunds',
  };

  try {
    logger.debug('start:init');
    showBanner();

    // validate
    // validate template config with schema
    /* const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(template)) throw Error('Invalid Template'); */

    const scriptKeys: string[] = Object.keys(scripts);

    const index: number = readlineSync.keyInSelect(
      scriptKeys.map(key => chalk.cyan(key)),
      colorOutput({
        item: SCRIPTS.PROMPT_SCRIPT,
        style: OutputStyles.Question,
      }),
      { cancel: chalk.red(SCRIPTS.EXIT) },
    );

    if (index !== -1) {
      const key = scriptKeys[index];

      const script = path.resolve('dist', scripts[key]);

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
        init();
      });
    } else {
      showBanner(true);
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default init();
