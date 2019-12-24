const path = require('path');
const { ProgressPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const plugins = [new ForkTsCheckerWebpackPlugin(), new ProgressPlugin()];

const entry = {
  start: ['./src/start.ts'],
  configureCampaign: ['./src/configureCampaign/index.ts'],
};

const files = {
  test: /\.(png|jpe?g|gif|txt)$/i,
  exclude: /node_modules/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: () =>
          NODE_ENV === 'development'
            ? '[path][name].[ext]'
            : '[contenthash].[ext]',
      },
    },
  ],
};

const source = {
  test: /\.(ts|js)x?$/,
  loader: 'ts-loader',
  options: {
    transpileOnly: true,
    reportFiles: ['src/**/*.{ts,tsx,d.ts}'],
  },
};

const stats = {
  env: true,
  colors: true,
  warningsFilter: [
    './node_modules/log4js/lib/appenders/index.js',
    './node_modules/engine.io-client/node_modules/ws/lib/validation.js',
    './node_modules/engine.io-client/node_modules/ws/lib/buffer-util.js',
  ],
};

module.exports = {
  mode: NODE_ENV,
  target: 'node',
  watch: NODE_ENV === 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [files, source],
  },
  entry,
  stats,
  plugins,
};
