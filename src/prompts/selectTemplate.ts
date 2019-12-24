import fs from 'fs-extra';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import path from 'path';
import chalk from 'chalk';
import settings from '../../settings.json';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers';

/**
 * Promps user to select a template
 *
 * @returns {(Promise<Template | null>)}
 */
const selectTemplate = async (): Promise<Template | null> => {
  const logger = getLogger('selectTemplate');
  const { SCRIPTS, CAMPAIGN } = getLocales(settings.locale as Locale);

  try {
    // prints title
    logger.info(
      colorOutput({
        item: CAMPAIGN.TEMPLATES_TITLE,
        style: OutputStyles.Title,
      }),
    );

    // gets list of directories
    const dirs = fs.readdirSync(path.resolve(settings.templateDir));
    if (dirs.length === 0) throw Error('No templates');

    // maps all available templates
    const templates = dirs.map(dir => {
      const template = JSON.parse(
        fs
          .readFileSync(`${settings.templateDir}/${dir}/config.json`)
          .toString(),
      );
      return template;
    });

    // promp user to select directory
    const index = readlineSync.keyInSelect(
      templates.map(t => chalk.cyan(t.title)),
      colorOutput({
        item: SCRIPTS.SELECT_TEMPLATE,
        style: OutputStyles.Question,
      }),
      { cancel: chalk.red(SCRIPTS.EXIT), defaultInput: '1' },
    );

    // return null if user cancels
    if (index === -1) return null;

    return templates[index];
  } catch (error) {
    throw logger.error(error);
  }
};

export default selectTemplate;
