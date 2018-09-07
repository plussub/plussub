// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/chrome/background.js',
    output: {
        filename: 'background_build.js',
        path: path.resolve(__dirname)+'/../src/chrome/gen/'
    },
    mode: 'development',
    module: {
        // rules: [
        //     {
        //         test: /\.js$/,
        //         exclude: /(node_modules|bower_components)/,
        //         use: {
        //             loader: 'babel-loader',
        //             options: {
        //                 presets: ['@babel/preset-env']
        //             }
        //         }
        //     }
        // ]
    }
};