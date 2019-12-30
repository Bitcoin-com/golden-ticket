/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('pkg');
const fs = require('fs-extra');

const init = async () => {
  await exec(['dist/index.js', '--out-path', 'bin']);

  fs.copySync('templates', 'bin/templates');
  fs.copySync('settings.json', 'bin/settings.json');

  fs.copySync('node_modules/pdfkit/js/data', 'bin/node_modules/pdfkit/js/data');
  fs.copySync(
    'node_modules/unicode-properties/data.trie',
    'bin/node_modules/unicode-properties/data.trie',
  );
};

init();
