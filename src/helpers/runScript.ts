import childProcess from "child_process";

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
  callback: (props?: object | Error | null) => void
): void => {
  const process = childProcess.fork(modulePath, args);
  let invoked = false;

  process.on("error", err => {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  process.on("exit", code => {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error("Exit code " + code);
    callback(err);
  });
};

export default runScript;
