# Developer Documentation

Read through this document before starting any development on GoldenTicket.

- [Developer Documentation](#developer-documentation)
  - [Quick Start](#quick-start)
  - [Localization](#localization)
    - [Create new translations file](#create-new-translations-file)
    - [Map new translations](#map-new-translations)
      - [Import new locale](#import-new-locale)
      - [Update getLocales function](#update-getlocales-function)
      - [Update getLanguage function](#update-getlanguage-function)
    - [Use translation strings](#use-translation-strings)
  - [Logging](#logging)
    - [Using Log4js](#using-log4js)
    - [Formatting Logs](#formatting-logs)
      - [colorOutput configuration](#coloroutput-configuration)
      - [OutputStyles](#outputstyles)
      - [Example](#example)
  - [Visual Studio Code](#visual-studio-code)
    - [Extensions](#extensions)
    - [Settings](#settings)

## Quick Start

Like most other Nodejs projects, simply install denendencies, build and run. There's an extra bundle script to create OS specific binaries

1. `yarn install` - Install dependencies
2. `yarn [build|dev]` - Run webpack or webpack --watch
3. `yarn start` - Start GoldenTicket
4. `yarn bundle` - Compile binaries

## Localization

GoldenTicket is setup for localization support. The translation strings are stored in json files and are located in `src/i18n`.

### Create new translations file

Create json file in `i18n` directory and copy/paste the contents of `en.json`. Or copy/paste `en.json` and rename the file. For consistency, the file name should be a valid [ISO 639-1 Language Code](https://www.w3schools.com/tags/ref_language_codes.asp) (eg. `zu.json` or `en-UK.json`).

_NOTE: Matching Language Code is not compulsory but the following Regex check is made when validating the `settings.json` file on startup - `/^[a-z]{2,3}(?:-[A-Z]{2,2}(?:-[a-zA-Z]{4})?|(?:-Cyrl|-Hast|-Hant|-Arab|-Latn)?)?$/`_

### Map new translations

Edit `i18n/index.ts` to map new translations.

Example below adds a new Zulu translation (substitue `zu` with language code of desired translation).

#### Import new locale

Add import for the new locale file to top of `i18n/index.ts`

```js
import getSettings from '../helpers/getSettings';
import en from './en.json';
import zu from './zu.json'; // add the import
...
```

#### Update `getLocales` function

Add import to the locales object in `getLocales` function

```js
export const getLocales = (locale: string = settings.locale): Locales => {
  const locales: {
    [key: string]: Locales,
  } = {
    en,
    zu, // add zu import to the locales object
    ...
  };

  ...
```

#### Update `getLanguage` function

The `getLanguage` function maps the locale iso code to a language recognized by the Mnemonic generator in bitbox-sdk.

_NOTE: Mnemonic generation languages must be one from in the [bitbox-sdk wordlist](https://developer.bitcoin.com/bitbox/docs/mnemonic#generate)_

```js
export const getLanguage = (locale: string): string => {
  const languageMap: {
    [key: string]: string,
  } = {
    en: 'english',
    zu: 'english', // give zu a mnemonic generation language
    ...
  };

  ...
```

### Use translation strings

To access the translations use the `getLocales` function and pass it the locale you wish to use. Accessing the translation strings can be done by passing the app's locale to `getLocales`

```js
/* imprt getSettings and getLocales */
import getSettings from './src/helpers/getSettings';
import { getLocales } from './src/i18n';

/* get local from settings.json */
const { locale } = getSettings();

/* get the locales translation strings */
const { QUESTIONS } = getLocales(locale);

/* use the translation */
console.log(QUESTIONS.CAMPAIGN_CONFIRM);

// Are you happy with your campaign?
```

## Logging

GoldenTicket has a custom logger setup which handles the information displayed in the console and the log files saved in the `log` directory. Log4js is used to handle the output and a custom formatted was written to style and format the console logs.

### Using Log4js

Import, initialize and use logger with the code below.

```js
/* import the logger initlializer */
import { getLogger } from 'log4js';

/* initialize the logger */
const logger = getLogger();

/* outputs info to screen and file (saves data to log/app.log) */
logger.info();

/* outputs errors screen and file (saves data to log/errors.log) */
logger.error();

/* outputs debug data to screen (if debug = true in settings.json) */
logger.debug();
```

### Formatting Logs

The `colourOutput` helper is used to style the console output. It accepts an object with the following settings

#### colorOutput configuration

Pass a configuration object to `colorOutput` with the following.

| Setting     | Description                                      |
| ----------- | ------------------------------------------------ |
| `item`      | `string` - required, the text to display         |
| `value`     | `string|number` - optional, the value to display |
| `linebreak` | `boolean` - optional, include linebreak after    |
| `style`     | `string` - optional, OutputStyle to format with  |

#### OutputStyles

Style the console log to keep a consistent color scheme. These styles are included in an exported `OutputStyles` object from `src/helpers/colorFormatters`.

| Style         | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| `default`     | normal information - white item, cyan value                                             |
| `title`       | section title, clears console (`console.clear()`) - yellow bg/white text item, no value |
| `information` | highlight extra information (eg ticket spread) - cyan bg/black text item and vlaue      |
| `question`    | prompt user for input - magenta text item, white text value (add brackets `[value]:`)   |
| `warning`     | warn user - red bg/white text item, no value                                            |

#### Example

Below exmple is a screen asking user to choose a campaign title

```js
/* import the formatter, loger and readlineSync to ask a question */
import { colourOutput, OutputStyles } from './src/helpers/colorFormatters';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';

/* initialize the logger */
const logger = getLogger();

/* item only with linebreak - title style */
logger.info(
  colorOutput({
    item: 'Campaign Title',
    style: OutputStyles.Title,
    lineabreak: true,
  }),
);

/* item and value - default styling */
logger.info(
  colorOutput({
    item: 'Current Title',
    value: 'GoldenTicket',
  }),
);

/* item and value - question style */
const title: string = readlineSync.question(
  colorOutput({
    item: 'Choose a new campaign title',
    value: 'GoldenTicket',
    style: OutputStyles.Question,
  }),
);
```

## Visual Studio Code

Here's some handy extensions and settings for those using vscode.

### Extensions

- [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis) - Automatically generates detailed JSDoc comments in TypeScript and JavaScript files.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Integrates ESLint JavaScript into VS Code.
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) - All you need to write Markdown (keyboard shortcuts, table of contents, auto preview and more)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter using prettier

### Settings

```json
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
],
"editor.formatOnSave": true,

"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```
