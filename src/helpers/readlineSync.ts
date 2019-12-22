import readlineSync, { BasicOptions } from "readline-sync";
import getLogger from "./logger";
import { colorDisplay } from "./colorFormatters";

const logger = getLogger("userInput");

const readlineSyncOptions: BasicOptions = {
  hideEchoBack: true,
  print: (display: string) => {
    const displayInfo = colorDisplay(display);
    return logger.info(displayInfo);
  }
};

readlineSync.setDefaultOptions(readlineSyncOptions);

export default readlineSync;
