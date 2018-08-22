// webpack.config.js
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: './src/chrome/content.js',
    output: {
        filename: 'content_build.js',
        path: path.resolve(__dirname)+'/../src/chrome/gen/'
    },
    mode: 'development',
    module: {
        rules: [
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
            }
        ]
    }
};