import chalk from 'chalk';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import path from 'path';
import readlineSync from 'readline-sync';
import { getLocales } from '../i18n';
import createCampaign from './createCampaign';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import getSettings from '../helpers/getSettings';

/**
 * Prompts user to select campaign from list
 *
 * @param {string} prompt
 * @returns {Promise<Campaign>}
 */
const selectCampaign = async (): Promise<Campaign | null> => {
  const logger = getLogger('selectCampaign');
  const settings = getSettings();
  const { QUESTIONS, TITLES, SCRIPTS } = getLocales(settings.locale);

  try {
    // print title
    logger.info(
      colorOutput({
        item: TITLES.CAMPAIGN_SELECT,
        style: OutputStyles.Title,
      }),
    );

    // ensure output directory
    fs.ensureDirSync(settings.outDir);

    // get list of directories
    const dirs = fs.readdirSync(path.resolve(settings.outDir));
    dirs.push(chalk.green(SCRIPTS.ADD_NEW));

    // promp user to select directory
    const index = readlineSync.keyInSelect(
      dirs.map(d => chalk.cyan(d)),
      colorOutput({
        item: QUESTIONS.CAMPAIGN_SELECT,
        style: OutputStyles.Question,
      }),
      { cancel: chalk.red(SCRIPTS.EXIT) },
    );

    // return null if user cancels
    if (index === -1) return null;

    // create campaign if user clicks Add
    if (index === dirs.length - 1) return await createCampaign();

    // write the config file and start createCampaign
    const campaignWallet = `${settings.outDir}/${dirs[index]}/config.json`;
    const rawFile = fs.readFileSync(campaignWallet).toString();
    const campaign = JSON.parse(rawFile);

    return campaign;
  } catch (error) {
    logger.error(error);
    readlineSync.keyInPause();
    throw logger.error(error);
  }
};

export default selectCampaign;
