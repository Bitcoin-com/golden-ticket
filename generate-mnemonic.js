const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default;
const BITBOX = new BITBOXCli();

console.log(`Your mnemonic is: ${BITBOX.Mnemonic.generate(256)}`);
