import fs from 'fs-extra';
import path from 'path';
import { getLogger } from 'log4js';
import chalk from 'chalk';

import banner from '../../assets/banner.txt';
import goodbye from '../../assets/goodbye.txt';

const logBanner = (end?: boolean): void => {
  const logger = getLogger();

  console.clear();
  logger.info(
    chalk.yellowBright(fs.readFileSync(path.resolve(end ? goodbye : banner))),
  );
};

export default logBanner;
