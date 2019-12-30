import Ajv from 'ajv';
import { keyInPause } from 'readline-sync';
import { getLogger } from 'log4js';
import settingsJSON from '../../settings.json';
import settingsSchema from '../schema/settings.json';

const getSettings = (): Settings => {
  const logger = getLogger();
  try {
    const ajv = new Ajv();
    const validate = ajv.compile(settingsSchema);
    if (!validate(settingsJSON)) throw Error('Invalid settings.json');

    return settingsJSON;
  } catch (error) {
    throw logger.error(error);
  }
};

export default getSettings;
