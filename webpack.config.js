/* eslint-disable */
var path = require( 'path' );
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        user: ['whatwg-fetch', './app/user/index.js'],
        host: ['whatwg-fetch', './app/host/index.js']
    },

    output: {
        path: 'dist',
        filename: 'js/[name].bundle.js'
    },

    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'app', 'user', 'index.html'),
            filename: 'user.html',
            inject: false
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'app', 'host', 'index.html'),
            filename: 'host.html',
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: 'app/assets',
                to: 'assets'
            }
        ])
    ],

    resolve: {
        alias: {
            constants$: path.resolve(__dirname, 'constants.js')
        }
    }
};
/* eslint-enable */
