// import ajv from 'ajv';
import { configure, getLogger } from 'log4js';
import chalk from 'chalk';
import path from 'path';
import { keyInSelect } from 'readline-sync';

import { getLocales } from './i18n';

import { OutputStyles, colorOutput } from './helpers/colorFormatters';
import loggerConfig from './helpers/loggerConfig';
import getSettings from './helpers/getSettings';
import runScript from './helpers/runScript';

import logBanner from './logger/logBanner';
import logRunScript from './logger/logRunScript';

/**
 * Initializes scripts selection and launches selected script
 *
 * @returns {Promise<void>}
 */
const selectScript = (): void => {
  const logger = getLogger();
  configure(loggerConfig);

  try {
    const settings = getSettings();
    const { SCRIPTS, QUESTIONS } = getLocales(settings.locale);

    const scripts: { [any: string]: string } = {
      [SCRIPTS.NAMES.CAMPAIGN_CONFIGURE]: 'configureCampaign',
      [SCRIPTS.NAMES.FUND_CAMPAIGN]: 'fundCampaign',
      [SCRIPTS.NAMES.CHECK_TICKETS]: 'checkCampaign',
      [SCRIPTS.NAMES.GENERATE_STATS]: 'generateStats',
      [SCRIPTS.NAMES.RECLAIM_FUNDS]: 'reclaimFunds',
    };

    logBanner();

    // validate
    // validate template config with schema
    /* const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(template)) throw Error('Invalid Template'); */

    // array of script titles
    const scriptKeys: string[] = Object.keys(scripts);

    // prompt user to select a script
    const index: number = keyInSelect(
      scriptKeys.map(key => chalk.cyan(key)),
      colorOutput({
        item: QUESTIONS.SCRIPTS_SELECT,
        style: OutputStyles.Question,
      }),
      { cancel: chalk.red(SCRIPTS.EXIT) },
    );

    // user exits
    if (index === -1) {
      logBanner(true);
      return;
    }

    // get module path
    const key = scriptKeys[index];
    const modulePath = path.resolve('dist', scripts[key]);

    logRunScript(scriptKeys[index]);

    // run selected script
    runScript(modulePath, [], () => {
      logRunScript(scriptKeys[index], true);

      // script finished. restart this
      selectScript();
    });
  } catch (error) {
    throw logger.error(error);
  }
};

export default selectScript();
