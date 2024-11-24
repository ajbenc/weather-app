// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // Easier debugging
  devServer: {
    static: './dist',
    hot: true, // Hot reloading
  },
});
