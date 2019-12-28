import { getLogger } from 'log4js';
import getSettings from './getSettings';
import { getLocales } from '../i18n';
import { OutputStyles, colorOutput } from './colorFormatters';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

/**
 * Prints campaign output information
 *
 * @param {Campaign} campaignData
 * @param {string} path
 */
const displayCampaignOutput = (campaignData: Campaign, path: string): void => {
  // banner
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_CREATED,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  // title
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TITLE,
      value: campaignData.title,
    }),
  );

  // directory
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_PATH,
      value: `${path}/`,
    }),
  );

  // privkeys
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_WIFS,
      value: `${path}/privKeyWIFs`,
    }),
  );

  // csv
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_CSV,
      value: `${path}/campaign.csv`,
    }),
  );

  // html directory
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_HTML,
      value: `${path}/html/`,
    }),
  );

  // pdf directory
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_PDF,
      value: `${path}/pdf/`,
      lineabreak: true,
    }),
  );
};

export default displayCampaignOutput;
