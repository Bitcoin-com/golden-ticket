import fs from 'fs-extra';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import path from 'path';
import chalk from 'chalk';
import settings from '../../settings.json';
import { getLocales } from '../i18n';
import createCampaign from './createCampaign';
import { colorOutput, OutputStyles } from '../helpers';

/**
 * Prompts user to select campaign from list
 *
 * @param {string} prompt
 * @returns {Promise<Campaign>}
 */
const selectCampaign = async (): Promise<Campaign | null> => {
  const logger = getLogger('selectCampaign');
  const { SCRIPTS, CAMPAIGN } = getLocales(settings.locale as Locale);

  try {
    // ensure output directory
    fs.ensureDirSync(settings.outDir);

    // get list of directories
    const dirs = fs.readdirSync(path.resolve(settings.outDir));
    dirs.push(chalk.yellow('+ ADD NEW'));

    // eslint-disable-next-line no-console
    console.clear();

    logger.info(
      colorOutput({
        item: CAMPAIGN.CAMPAIGNS_TITLE,
        style: OutputStyles.Title,
      }),
    );

    // promp user to select directory
    const index = readlineSync.keyInSelect(
      dirs.map(d => chalk.cyan(d)),
      colorOutput({ item: SCRIPTS.SELECT_CAMPAIGN, value: '' }),
      { cancel: chalk.red(SCRIPTS.EXIT) },
    );

    // return null if user cancels
    if (index === -1) return null;

    // create campaign if user clicks Add
    if (index === dirs.length - 1) return await createCampaign();

    // get the filename ready
    const campaignWallet = `${settings.outDir}/${dirs[index]}/config.json`;

    // get the campaign file
    const rawFile = fs.readFileSync(campaignWallet).toString();
    const campaign = JSON.parse(rawFile);

    await createCampaign(campaign);
  } catch (error) {
    throw logger.error(error);
  }
};

export default selectCampaign;
