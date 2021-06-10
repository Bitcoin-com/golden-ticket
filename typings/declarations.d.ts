/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'to-regex-range';
declare module 'qrcode-terminal';
declare module 'bchaddrjs-slp';
declare module 'log4js';

declare module '*.txt' {
  const content: string;
  export = content;
}

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.trie' {
  const value: any;
  export = value;
}
