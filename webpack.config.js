const webpack = require('webpack');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const entry = {
  start: ['./src/start.ts'],
  configureCampaign: ['./src/configureCampaign/index.ts'],
};

const rules = [
  {
    test: /\.(png|jpe?g|gif|txt)$/i,
    exclude: /node_modules/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: file =>
            NODE_ENV === 'development'
              ? '[path][name].[ext]'
              : '[contenthash].[ext]',
        },
      },
    ],
  },
  {
    test: /\.(ts|js)x?$/,
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  },
];

const stats = {
  colors: true,
};

module.exports = {
  mode: NODE_ENV,
  target: 'node',
  entry,
  watch: NODE_ENV === 'development' ? true : false,
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
  },
  stats,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: { rules },

  plugins: [
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new ForkTsCheckerWebpackPlugin(),
  ],
};
