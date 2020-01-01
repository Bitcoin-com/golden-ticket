/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path');
const { ProgressPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const entry = {
  index: [path.join(process.cwd(), './src/index.ts')],
};

ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE;

const output = {
  path: path.join(process.cwd(), 'dist'),
  filename: '[name].js',
};

module.exports = {
  mode: NODE_ENV,
  target: 'node',
  node: { __dirname: true, __filename: true, fs: 'empty' },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      fs: 'fs-extra',
    },
  },
  entry,
  devtool: 'sourcemap',
  output,
  module: {
    rules: [
      {
        test: /unicode-properties[/\\]unicode-properties.es.js$/,
        loader: 'string-replace-loader',
        options: {
          search: `__dirname + '/data.trie'`,
          replace: `'data/data.trie'`,
        },
      },
      {
        test: /pdfkit.es5.js$/,
        loader: 'string-replace-loader',
        options: {
          search: `__dirname + '/data/Helvetica.afm'`,
          replace: `'data/Helvetica.afm'`,
        },
      },
      {
        test: /\.(png|jpe?g|gif|txt)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets',
          publicPath: 'assets',
        },
      },
      {
        test: /\.(ts|js)x?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        enforce: 'post',
        test: /fontkit[/\\]index.js$/,
        loader: 'transform-loader?brfs',
      },
      {
        enforce: 'post',
        test: /unicode-properties[/\\]index.js$/,
        loader: 'transform-loader?brfs',
      },
      {
        enforce: 'post',
        test: /linebreak[/\\]src[/\\]linebreaker.js/,
        loader: 'transform-loader?brfs',
      },
    ],
  },
  externals: {
    'qrcode-react': 'node_modules/qrcode-terminal/lib/main.js',
  },
  stats: {
    env: true,
    colors: true,
    warningsFilter: [
      './node_modules/log4js/lib/appenders/index.js',
      './node_modules/engine.io-client/node_modules/ws/lib/validation.js',
      './node_modules/engine.io-client/node_modules/ws/lib/buffer-util.js',
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      reportFiles: ['src/**/*.{ts,tsx}', '!src/**/*.{json}'],
    }),
    new ProgressPlugin(),
    new CopyPlugin([
      { from: 'templates', to: 'templates' },
      { from: 'data', to: 'data' },
      { from: 'settings.json', to: 'settings.json' },
    ]),
  ],
};
