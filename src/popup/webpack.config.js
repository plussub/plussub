// webpack.config.js
const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/popup/index.ts',
  output: {
    filename: 'popup.js',
    path: `${path.resolve(__dirname)}/../../dist`
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname),
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      'vue': '@vue/runtime-dom',
      'useAppStateStorageListener': `${path.resolve(__dirname)}/platform/useAppStateStorageListener/chrome/index.ts`,
      'getBackgroundPage': `${path.resolve(__dirname)}/platform/getBackgroundPage/chrome/index.ts`,
      'findVideosInCurrentTab': `${path.resolve(__dirname)}/platform/findVideosInCurrentTab/chrome/index.ts`,
      'addSubtitleInCurrentTab': `${path.resolve(__dirname)}/platform/addSubtitleInCurrentTab/chrome/index.ts`,
      'storage': `${path.resolve(__dirname)}/../shared/platform/storage/chrome/index.ts`
    }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          // {
          //   loader: 'file-loader',
          // },
          {
            loader: 'url-loader',
            options: {
              limit: 102400
            }
          }
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: 'file-loader?name=fonts/[name].[ext]!static'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({filename: 'popup.html'}),
  ]
};
