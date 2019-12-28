import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO, QUESTIONS } = getLocales(settings.locale);

const logGenerateWIFs = ({ wif }: { wif: string }): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_WIFS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_WIFS,
      value: wif,
      lineabreak: true,
    }),
  );
  logger.info(
    colorOutput({
      item: QUESTIONS.WAIT,
      style: OutputStyles.Question,
    }),
  );
};

export default logGenerateWIFs;
