// webpack.config.js
/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const ExtensionReloader = require('webpack-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const browser = argv.browser ? argv.browser.toLowerCase() : 'chrome'; // chrome or firefox
  let manifestName;
  let outputPath;
  switch (browser) {
    case 'firefox':
      manifestName = 'manifestFirefox.json';
      outputPath = 'dist-firefox';
      break;
    default:
      manifestName = 'manifestChrome.json';
      outputPath = 'dist-chrome';
  }
  const config = {
    mode: argv.mode ? argv.mode : 'development',
    entry: { popup: './popup/index.ts', background: './background/index.ts' },
    context: path.resolve(__dirname, 'src'),
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, outputPath)
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src/popup'),
        // '#': path.resolve(__dirname, '/platform/storage/chrome/index.ts'),
        // this isn't technically needed, since the default `vue` entry for bundlers
        // is a simple `export * from '@vue/runtime-dom`. However having this
        // extra re-export somehow causes webpack to always invalidate the module
        // on the first HMR update and causes the page to reload.
        vue: '@vue/runtime-dom',
        useAppStateStorageListener: path.resolve(__dirname, `src/popup/platform/useAppStateStorageListener/${browser}/index.ts`),
        storage: path.resolve(__dirname, `src/popup/platform/storage/${browser}/index.ts`),
        onInstalled: path.resolve(__dirname, `src/background/platform/onInstalled/${browser}/index.ts`),
        onPageActionClicked: path.resolve(__dirname, `src/background/platform/onPageActionClicked/${browser}/index.ts`)
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['vue-style-loader', 'css-loader', 'sass-loader']
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
          test: /\.(png|jpe?g|gif|svg)$/i,
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
          ]
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
            appendTsSuffixTo: [/\.vue$/]
          }
        },
        {
          test: /\.html$/i,
          loader: 'html-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new ExtensionReloader(),
      new CopyPlugin({
        patterns: [
          { from: manifestName, to: 'manifest.json' },
          { from: 'res', to: 'res' }
        ]
      })
    ]
  };
  return config;
};
