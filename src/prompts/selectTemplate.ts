import chalk from 'chalk';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import path from 'path';
import readlineSync from 'readline-sync';
import { getLocales } from '../i18n';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import getSettings from '../getSettings';

/**
 * Promps user to select a template
 *
 * @returns {(Promise<Template | null>)}
 */
const selectTemplate = (): Template | null => {
  const logger = getLogger('selectTemplate');
  const settings = getSettings();
  const { SCRIPTS, CAMPAIGN } = getLocales(settings.locale);

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
