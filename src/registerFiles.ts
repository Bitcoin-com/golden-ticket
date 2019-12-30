/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fs = require('fs-extra');
const path = require('path');

const registerAFMFonts = ctx => {
  ctx.keys().forEach(key => {
    const match = key.match(/([^/]*\.afm$)/);
    if (match) {
      // afm files must be stored on data path
      fs.writeFileSync(
        path.resolve(`assets/fonts/${match[0]}`),
        ctx(key).default,
      );
    }
  });
};

// register AFM fonts distributed with pdfkit
// is good practice to register only required fonts to avoid the bundle size increase
registerAFMFonts(require.context('pdfkit/js/data', false, /Helvetica.*\.afm$/));
