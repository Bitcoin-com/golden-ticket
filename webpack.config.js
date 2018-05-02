let path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      },
      {
        test:/\.(s*)css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            // modules: true,
            // localIdentName: '[name]'
            // localIdentName: '[path][name]__[local]--[hash:base64:5]'
          }
        }, {
          loader: 'sass-loader'
        }
      ]
    }]
  }
};
