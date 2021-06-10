import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const logger = getLogger('generatePDF');
const settings = getSettings();

const { INFO, TITLES, QUESTIONS } = getLocales(settings.locale);

const logGeneratePDF = ({
  title,
  filename,
}: {
  title: string;
  filename: string;
}): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_PDF,
      value: title,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_PDF,
      value: filename,
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

export default logGeneratePDF;
