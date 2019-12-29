import { getLogger } from 'log4js';
import { readFileSync } from 'fs-extra';
import getSettings from './getSettings';

const getTicketStats = (title: string): CSV[] => {
  const logger = getLogger();
  const settings = getSettings();

  try {
    return JSON.parse(
      readFileSync(`${settings.outDir}/${title}/campaign.json`).toString(),
    );
  } catch (error) {
    throw logger.error(error);
  }
};

export default getTicketStats;
