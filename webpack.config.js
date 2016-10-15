var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    user: './app/user/index.js',
    host: './app/host/index.js'
  },

  output: {
    path: 'dist',
    filename: 'js/[name].bundle.js'
  },

  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    ]
  },

  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: __dirname + '/app/user/index.html',
      filename: 'user.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: __dirname + '/app/host/index.html',
      filename: 'host.html',
      inject: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'app/assets',
        to: 'assets'
      }
    ])
  ]
};
