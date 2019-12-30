import { configure, getLogger } from 'log4js';
import chalk from 'chalk';
import { keyInSelect } from 'readline-sync';

import { getLocales } from './i18n';

import { OutputStyles, colorOutput } from './helpers/colorFormatters';
import loggerConfig from './helpers/loggerConfig';
import getSettings from './helpers/getSettings';

import logBanner from './logger/logBanner';
import logRunScript from './logger/logRunScript';

import configureCampaign from './configureCampaign';
import fundCampaign from './fundCampaign';
import checkCampaign from './checkCampaign';

/**
 * Initializes scripts selection and launches selected script
 *
 * @returns {Promise<void>}
 */
const start = async (): Promise<void> => {
  const logger = getLogger();
  configure(loggerConfig);

  try {
    const settings = getSettings();
    const { SCRIPTS, QUESTIONS } = getLocales(settings.locale);

    const scripts: { [any: string]: () => Promise<void> } = {
      [SCRIPTS.NAMES.CAMPAIGN_CONFIGURE]: configureCampaign,
      [SCRIPTS.NAMES.FUND_CAMPAIGN]: fundCampaign,
      [SCRIPTS.NAMES.CHECK_TICKETS]: checkCampaign,
    };

    logBanner();

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

    const key = scriptKeys[index];

    logRunScript(scriptKeys[index]);

    await scripts[key]();
    start();
    /* // run selected script
    runScript(scripts[key], [], err => {
      if (err) throw logger.error(err);

      logRunScript(scriptKeys[index], true);

      // script finished. restart this
      start();
    }); */
  } catch (error) {
    throw logger.error(error);
  }
};

export default start;
