/* eslint-disable */
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        user: ['whatwg-fetch', path.resolve(__dirname, 'user', 'index.js')],
        host: ['whatwg-fetch', path.resolve(__dirname, 'host', 'index.js')]
    },

    output: {
        path: path.resolve(__dirname, '..', 'build'),
        filename: 'js/[name].bundle.js'
    },

    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'user', 'index.html'),
            filename: 'user.html',
            inject: false
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'host', 'index.html'),
            filename: 'host.html',
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'assets'),
                to: 'assets'
            }
        ])
    ],


    resolve: {
        alias: {
            constants$: path.resolve(__dirname, '..', 'shared', 'constants.js')
        }
    }
};
/* eslint-enable */
