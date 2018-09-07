// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/background/background.js',
    output: {
        filename: 'background_build.js',
        path: path.resolve(__dirname)+'/../src/background/gen/'
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