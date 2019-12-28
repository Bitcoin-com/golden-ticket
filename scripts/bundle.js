/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const { compile } = require('nexe');
const { getLogger } = require('log4js');
const { version } = require('../package.json');

const logger = getLogger();

const targets = {
  win: 'win32-x86-10.13.0',
  linux: 'linux-x64',
  mac: 'macos-10.13.0',
};

const runCompile = async target => {
  try {
    const config = {
      name: 'GoldenTicket',
      input: './dist/start.js',
      output: `./bin/GoldenTicket-${targets[target]}-v${version}`,
      resources: ['./dist/**/*'],
      target: targets[target],
      rc: {
        CompanyName: 'Bitcoin.com',
        ProductName: 'Golden Ticket',
        FileDescription: 'Golden Ticket campaign management tool',
        ProductVersion: 'v3.0',
        LegalCopyright: 'Copyright Bitcoin.com. MIT license.',
      },
    };
    await compile(config);
  } catch (error) {
    throw logger.error(error);
  }
};

const init = async () => {
  const targetKeys = Object.keys(targets);
  for (let i = 0; i < targetKeys.length; i++) {
    await runCompile(targetKeys[i]);
  }
};

init();
