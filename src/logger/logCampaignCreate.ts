import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

const displayCampaignCreate = (campaign?: Campaign): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_TITLE,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  // display current title if editing campaign
  if (campaign) {
    logger.info(
      colorOutput({
        item: INFO.CAMPAIGN_TITLE_CURRENT,
        value: campaign.title,
        lineabreak: true,
      }),
    );
  }
};

export default displayCampaignCreate;
