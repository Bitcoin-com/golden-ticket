import { getLogger } from 'log4js';

import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';

const logger = getLogger();
const settings = getSettings();
const { SCRIPTS } = getLocales(settings.locale);

const logRunScript = (title: string, end?: boolean): void => {
  if (end) {
    logger.info(
      colorOutput({
        item: SCRIPTS.END_RUNNING,
        value: title,
        style: OutputStyles.Complete,
      }),
    );
  } else {
    logger.info(
      colorOutput({
        item: SCRIPTS.START_RUNNING,
        value: title,
        style: OutputStyles.Start,
      }),
    );
  }
};

export default logRunScript;
