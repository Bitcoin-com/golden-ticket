import fs from 'fs-extra';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import path from 'path';
import settings from '../../../settings.json';
import createCampaign from './createCampaign';
import { getLocales } from '../../i18n';
import { colorQuestion } from '../colorFormatters';

/**
 * Prompts user to select campaign from list
 *
 * @param {string} prompt
 * @returns {Promise<Campaign>}
 */
const selectCampaign = async (): Promise<Campaign | null> => {
  const logger = getLogger('selectCampaign');
  const strings = getLocales(settings.locale as Locale);

  try {
    // ensure output directory
    fs.ensureDirSync(settings.templateDir);

    // get list of directories
    const dirs = fs.readdirSync(path.resolve(settings.outDir));

    // start prompt if there's directories
    if (dirs.length > 0) {
      // promp user to select directory
      const index = readlineSync.keyInSelect(
        dirs,
        strings.SCRIPTS.SELECT_CAMPAIGN,
      );

      // return null if user cancels
      if (index === -1) return null;

      // get the filename ready
      const campaignWallet = `${settings.outDir}/${dirs[index]}/wallet.json`;

      // get the campaign file
      const rawFile = fs.readFileSync(campaignWallet).toString();

      // parse and return campaign data
      return JSON.parse(rawFile);
    }

    // should create campaign
    const yesCreate = readlineSync.keyInYN(
      colorQuestion(strings.CAMPAIGN.NO_CAMPAIGNS, 'y/n'),
      { guide: false },
    );

    return yesCreate ? await createCampaign() : null;
  } catch (error) {
    throw logger.error(error);
  }
};

export default selectCampaign;
