// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootDir = `${path.resolve(__dirname)}/../..`;

module.exports = {
  entry: './src/background/index.ts',
  output: {
    filename: 'background.js',
    path: `${rootDir}/../../dist`
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '#': `${rootDir}`,
      'onInstalled': `${rootDir}/platform/onInstalled/chrome/index.ts`,
      'onPageActionClicked': `${rootDir}/platform/onPageActionClicked/chrome/index.ts`
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
