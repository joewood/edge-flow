const path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
    './src/example/app.tsx'
  ],
  output: {
    pathinfo: true,
    filename: './src/example/bundle.js',
    publicPath: '/'
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: [ '.webpack.js', '.web.js', '.ts', '.js', '.tsx']
  },
  module: {
    loaders: [
      { test: /\.ts.?$/, loader: 'ts-loader' },
      {
        test: /\.(s?)css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: /\/favicon.ico$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\/favicon.ico$/,
        loader: 'file-loader',
        query: {
          name: 'favicon.ico?[hash:8]'
        }
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          attrs: ['link:href'],
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
}