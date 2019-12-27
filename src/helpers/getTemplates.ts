import fs from 'fs-extra';
import path from 'path';
import getSettings from '../getSettings';

/**
 * Returns object containing templates
 *
 * @returns {{ [key: string]: Template }}
 */
const getTemplates = (): { [key: string]: Template } => {
  const settings = getSettings();
  const dirs = fs.readdirSync(path.resolve(settings.templateDir));
  if (dirs.length === 0) throw Error('No templates');

  // maps all available templates
  const templates = dirs.reduce((prev, curr) => {
    const template = JSON.parse(
      fs.readFileSync(`${settings.templateDir}/${curr}/config.json`).toString(),
    );
    return { ...prev, [curr]: template };
  }, {});

  return templates;
};

export default getTemplates;
