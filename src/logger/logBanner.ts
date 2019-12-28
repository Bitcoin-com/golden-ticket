import path from 'path';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import chalk from 'chalk';

import banner from '../assets/banner.txt';
import goodbye from '../assets/goodbye.txt';

const logBanner = (end?: boolean): void => {
  const logger = getLogger();

  // display the golden ticket ascii text
  const bannerString: string = fs
    .readFileSync(path.resolve('dist', end ? goodbye : banner))
    .toString();

  // eslint-disable-next-line no-console
  console.clear();

  logger.info(chalk.yellowBright(bannerString));
};

export default logBanner;
