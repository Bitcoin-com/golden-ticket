import Ajv from 'ajv';
import fs from 'fs-extra';
import path from 'path';
import { getLogger } from 'log4js';

import settingsSchema from '../schema/settings.json';

const getSettings = (): Settings => {
  const logger = getLogger();
  try {
    const ajv = new Ajv();
    const validate = ajv.compile(settingsSchema);
    const settingsJSON = JSON.parse(
      fs.readFileSync(path.resolve('settings.json')).toString(),
    );

    if (!validate(settingsJSON)) throw Error('Invalid settings.json');

    return settingsJSON;
  } catch (error) {
    throw logger.error(error);
  }
};

export default getSettings;
