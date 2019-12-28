import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO, QUESTIONS } = getLocales(settings.locale);

const logGenerateCSV = ({
  title,
  address,
}: {
  title: string;
  address: string;
}): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_CSV,
      value: title,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_CSV,
      value: address,
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

export default logGenerateCSV;
