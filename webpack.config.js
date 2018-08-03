const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', './webfront/entry.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public/javascripts')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['env', { modules: false }], 'react', "stage-2"]
            }
          }
        ],
        // node_modules は除外する
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  // ソースマップを有効にする
  devtool: 'source-map'
};