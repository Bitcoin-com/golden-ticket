import path from 'path';
import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

/**
 * Prints campaign output information
 *
 * @param {Campaign} campaignData
 * @param {string} outputPath
 */
const displayCampaignOutput = (
  campaignData: Campaign,
  outputPath: string,
): void => {
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
      value: path.resolve(`${outputPath}/`),
    }),
  );

  // privkeys
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_WIFS,
      value: path.resolve(`${outputPath}/privKeyWIFs`),
    }),
  );

  // csv
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_CSV,
      value: path.resolve(`${outputPath}/campaign.csv`),
    }),
  );

  // html directory
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_HTML,
      value: path.resolve(`${outputPath}/html/`),
    }),
  );

  // pdf directory
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_PDF,
      value: path.resolve(`${outputPath}/pdf/`),
      lineabreak: true,
    }),
  );
};

export default displayCampaignOutput;
