const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,  
        use: ['style-loader', 'css-loader'],   
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',   
      filename: 'index.html',
    }),
  ],
  mode: 'production',  
};
