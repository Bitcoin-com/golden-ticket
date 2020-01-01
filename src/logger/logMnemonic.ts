import { getLogger } from 'log4js';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

const logCampaignMnemonic = (value?: string): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_MNEMONIC,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );
  if (value)
    logger.info(
      colorOutput({
        item: INFO.CAMPAIGN_MNEMONIC_CURRENT,
        value,
        lineabreak: true,
      }),
    );
};

export default logCampaignMnemonic;
