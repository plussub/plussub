// webpack.config.js
/* eslint @typescript-eslint/no-var-requires: "off" */
import {resolve} from 'path';
import {readFileSync} from 'fs';
import { VueLoaderPlugin } from 'vue-loader';
import CopyPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

const setObject = (object, key, value) => ({
  ...object,
  [key]: value,
});

const toPrettyJson = (obj) => JSON.stringify(obj, null, 2);

export default (env) => {
  const browser = (env.browser ? env.browser.toLowerCase() : 'unknown').trim();
  if (browser !== 'chrome' && browser !== 'firefox') {
    throw new Error(`unknown browser: ${browser}`);
  }
  const mode = (env.mode ? env.mode : 'development').trim();

  return {
    devtool: false,
    mode,
    entry: { popup: './popup/index.ts', background: './background/index.ts', contentScript: './contentScript/index.ts' },
    context: resolve('src'),
    output: {
      filename: '[name].js',
      path: resolve(`dist-${browser}`)
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json', '.mjs'],
      alias: {
        '@': resolve('src/popup'),
        storeTypes: resolve(`src/popup/storeTypes/index.ts`),
        storage: resolve(`src/popup/platform/storage/${browser}/index.ts`),
        monkeyPatchApollo: resolve(`src/popup/platform/monkeyPatchApollo/${browser}/index.ts`),
        onPageActionClicked: resolve(`src/background/platform/onPageActionClicked/${browser}/index.ts`)
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
          use: [
            {
              loader: 'style-loader',
              options: { injectType: 'singletonStyleTag', attributes: { id: 'plussub-style' } }
            },
            'css-loader',
            'postcss-loader'
          ]
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
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader'
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false
          }
        }
      ]
    },
    optimization: {},
    plugins: [
      new VueLoaderPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: `manifest-${browser}.json`,
            to: 'manifest.json',
            transform: (manifest) =>
              toPrettyJson(
                setObject(JSON.parse(manifest.toString()),
                  'version',
                  JSON.parse(readFileSync(resolve('package.json'))).version)
              )
          },
          { from: 'res', to: 'res' },
          { from: 'popup/font.css', to: 'font.css' },
          { from: 'contentScript/contentScript.css', to: 'contentScript.css' }
        ]
      }),
      new webpack.DefinePlugin({
        __VUE_PROD_DEVTOOLS__: 'false'
      })
    ]
  };
};
