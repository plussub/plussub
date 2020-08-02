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
      '#': path.resolve(__dirname),
      'contextMenu': `${path.resolve(__dirname)}/platform/contextMenu/chrome/index.ts`,
      'storage': `${path.resolve(__dirname)}/../shared/platform/storage/chrome/index.ts`
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
