import fs from 'fs-extra';
import { getLogger } from 'log4js';
import generateWIFs from './generateWIFs';
import generateHTML from './generateHTML';
import generatePDF from './generatePDF';
import settings from '../../settings.json';
import selectCampaign from '../prompts/selectCampaign';

const logger = getLogger('createTickets');

/**
 * Starts create tickets
 *
 * @returns {Promise<void>}
 */
const main = async (): Promise<void> => {
  try {
    const campaignData = await selectCampaign();
    if (!campaignData) return;
    const { title } = campaignData;

    // create needed directory structure
    fs.ensureDirSync(`${settings.outDir}/${title}/html/`);
    fs.ensureDirSync(`${settings.outDir}/${title}/pdf/`);
    fs.ensureFileSync(`${settings.outDir}/${title}/privKeyWIFs`);

    const wifs = await generateWIFs(campaignData);

    logger.info('============================================================');
    generateHTML(wifs, campaignData);
    logger.info('============================================================');
    generatePDF(wifs, campaignData);
    logger.info('============================================================');
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default main;
