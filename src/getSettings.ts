import Ajv from 'ajv';
import settingsJSON from '../settings.json';
import settingsSchema from './schema/settings.json';

const getSettings = (): Settings => {
  const ajv = new Ajv();
  const validate = ajv.compile(settingsSchema);

  if (!validate(settingsJSON)) throw Error('Invalid settings.json');

  return settingsJSON;
};

export default getSettings;
