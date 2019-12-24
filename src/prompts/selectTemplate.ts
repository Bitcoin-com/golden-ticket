import fs from 'fs-extra';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import path from 'path';
import Ajv from 'ajv';
import chalk from 'chalk';
import settings from '../../settings.json';
import schema from '../schema/template.json';
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
    // eslint-disable-next-line no-console
    console.clear();
    // get list of directories
    const dirs = fs.readdirSync(path.resolve(settings.templateDir));
    if (dirs.length === 0) throw Error('No templates');

    logger.info(
      colorOutput({
        item: CAMPAIGN.TEMPLATES_TITLE,
        style: OutputStyles.Title,
      }),
    );

    const getTempalteDir = (dir: string): string =>
      `${settings.templateDir}/${dir}/config.json`;

    const templates = dirs.map(dir => {
      // read and parse the template config
      const template = JSON.parse(
        fs.readFileSync(getTempalteDir(dir)).toString(),
      );
      return template;
    });

    // promp user to select directory
    const index = readlineSync.keyInSelect(
      templates.map(t => chalk.cyan(t.title)),
      colorOutput({ item: SCRIPTS.SELECT_TEMPLATE }),
      { cancel: chalk.red(SCRIPTS.EXIT), defaultInput: '1' },
    );

    // return null if user cancels
    if (index === -1) return null;

    const template = JSON.parse(
      fs.readFileSync(getTempalteDir(dirs[index])).toString(),
    );

    // validate template config with schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(template)) throw Error('Invalid Template');

    return template;
  } catch (error) {
    throw logger.error(error);
  }
};

export default selectTemplate;
