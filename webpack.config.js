const path = require('path');
const { ProgressPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const NODE_ENV = process.env.NODE_ENV || 'development';

const entry = {
  start: [path.join(process.cwd(), './src/index.ts')],
  configureCampaign: [path.join(process.cwd(), './src/configureCampaign.ts')],
};

ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE;

const output = {
  path: path.join(process.cwd(), 'dist'),
  filename: '[name].js',
};

module.exports = {
  mode: NODE_ENV,
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  entry,
  devtool: 'inline-source-map',
  output,
  module: {
    rules: [
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
    ],
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
  ],
};
