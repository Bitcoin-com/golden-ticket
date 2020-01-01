import { getLogger } from 'log4js';
import { readFileSync } from 'fs-extra';
import getSettings from './getSettings';

const getWIFS = (title: string): string[] => {
  const logger = getLogger();
  const settings = getSettings();

  try {
    return readFileSync(`${settings.outDir}/${title}/privKeyWIFs`)
      .toString()
      .split('\n');
  } catch (error) {
    throw logger.error(error);
  }
};

export default getWIFS;
