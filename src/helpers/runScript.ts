import childProcess from 'child_process';
import { keyInPause } from 'readline-sync';
import { getLogger } from 'log4js';
import path from 'path';

/**
 * Runs a node child proccess with chosen script
 *
 * @param {string} modulePath
 * @param {string[]} args
 * @param {((props?: object | Error | null) => void)} callback
 */
const runScript = (
  modulePath: string,
  args: string[],
  callback: (props?: object | Error | null) => void,
): void => {
  const logger = getLogger();

  try {
    const cp = childProcess.fork(modulePath, args);
    let invoked = false;

    cp.on('error', err => {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    cp.on('exit', code => {
      if (invoked) return;
      invoked = true;
      const err = code === 0 ? null : new Error(`Exit code ${code}`);
      callback(err);
    });
  } catch (error) {
    logger.error(error);
    keyInPause();
    throw logger.error(error);
  }
};

export default runScript;
