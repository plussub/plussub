// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/background/index.ts',
  output: {
    filename: 'background.js',
    path: `${path.resolve(__dirname)}/../../dist`
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      'contextMenu': `${path.resolve(__dirname)}/platform/contextMenu/chrome/index.ts`,
      '#': path.resolve(__dirname),
    }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'background.html'
  })]
};
