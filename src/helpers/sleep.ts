/**
 * Sleep for ms
 *
 * @param {number} ms
 */
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export default sleep;
