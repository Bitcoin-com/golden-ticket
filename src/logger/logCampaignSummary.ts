import { getLogger } from 'log4js';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import { getLocales } from '../i18n';
import getSettings from '../helpers/getSettings';
import formatSpread from '../helpers/formatSpread';

/**
 * Prints campaign information
 *
 * @param {Campaign} campaign
 */
const displayCampaignSummary = ({
  title,
  mothership: { fullNodePath, address, mnemonic, hdpath, wif },
  tickets,
  template,
}: Campaign): void => {
  const logger = getLogger();
  const settings = getSettings();
  const { TITLES, INFO } = getLocales(settings.locale);

  // banner
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_SUMMARY,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  // campaign title and template
  logger.info(colorOutput({ item: INFO.CAMPAIGN_TITLE, value: title }));
  logger.info(colorOutput({ item: INFO.CAMPAIGN_TEMPLATE, value: template }));

  // ticket information
  logger.info('\n--- Tickets ---');
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TICKETS_COUNT,
      value: `${tickets.count}`,
    }),
  );
  logger.info(colorOutput({ item: INFO.CAMPAIGN_TICKETS_SPREAD }));
  formatSpread(tickets.spread, tickets.count).forEach(el =>
    logger.info(colorOutput({ ...el, style: OutputStyles.Information })),
  );

  // mothership information
  logger.info('\n--- Mothership ---');
  logger.info(colorOutput({ item: INFO.CAMPAIGN_MNEMONIC, value: mnemonic }));
  logger.info(colorOutput({ item: INFO.CAMPAIGN_HDPATH, value: hdpath }));
  logger.info(colorOutput({ item: INFO.CAMPAIGN_HDNODE, value: fullNodePath }));
  logger.info(colorOutput({ item: INFO.CAMPAIGN_WIF, value: wif }));
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_ADDRESS,
      value: address,
      lineabreak: true,
    }),
  );
};

export default displayCampaignSummary;
