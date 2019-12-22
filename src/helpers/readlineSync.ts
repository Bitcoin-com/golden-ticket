import readlineSync, { BasicOptions } from "readline-sync";
import getLogger from "./logger";
import { colorDisplay } from "./colorFormatters";

const readline = readlineSync;
const logger = getLogger("userInput");
/* 
const readlineSyncOptions: BasicOptions = {
  hideEchoBack: true,
  print: (display: string) => {
    logger.debug("readlinsync", display);
    const displayInfo = colorDisplay(display);
    return logger.info(displayInfo);
  }
};

readline.setDefaultOptions(readlineSyncOptions);
 */
export default readlineSync;
