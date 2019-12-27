import { getLogger } from 'log4js';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import { getLocales } from '../i18n';
import getSettings from '../helpers/getSettings';
import formatSpread from '../helpers/formatSpread';

/**
 * Prints out campaign information
 *
 * @param {Campaign} campaign
 */
const displayCampaign = (campaign: Campaign): void => {
  const logger = getLogger();
  const settings = getSettings();
  const { TITLES, INFO } = getLocales(settings.locale);
  const { title, mothership } = campaign;
  const { fullNodePath, address, mnemonic, hdpath } = mothership;

  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_SUMMARY,
      value: title,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info('=== tickets ===');

  const { count, spread } = campaign.tickets;
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TICKETS_COUNT,
      value: campaign.tickets.count.toString(),
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TICKETS_SPREAD,
    }),
  );
  formatSpread(spread).forEach(element => {
    logger.info(colorOutput({ ...element, style: OutputStyles.Information }));
  });

  logger.info('=== mothership ===');
  logger.info(colorOutput({ item: INFO.CAMPAIGN_MNEMONIC, value: mnemonic }));
  logger.info(colorOutput({ item: INFO.CAMPAIGN_HDPATH, value: hdpath }));
  logger.info(colorOutput({ item: INFO.CAMPAIGN_HDNODE, value: fullNodePath }));
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_ADDRESS,
      value: address,
      lineabreak: true,
    }),
  );
};

export default displayCampaign;
