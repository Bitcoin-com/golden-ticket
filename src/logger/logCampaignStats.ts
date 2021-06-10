import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import { getLocales } from '../i18n';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

const logCampaignStats = (title: string, stats: CSV[]): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_STATS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TITLE,
      value: `${title}`,
    }),
  );

  logger.info(`--- Tickets ---`);
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TICKETS_COUNT,
      value: stats.length,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TICKETS_CLAIMED,
      value: stats.filter(s => s.claimed === true).length,
    }),
  );

  logger.info('--- Exports ---');
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_CSV,
      value: `${settings.outDir}/${title}/campaign.csv`,
    }),
  );
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_JSON,
      value: `${settings.outDir}/${title}/campaign.csv`,
      lineabreak: true,
    }),
  );
};

export default logCampaignStats;
