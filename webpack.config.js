const path = require("path");

module.exports = {
  entry: './src/example/app.tsx',
  output: {
    filename: './src/example/bundle.js'
  },
  debug: true,
  devtool: 'eval',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.tsx']
  },
  module: {
    loaders: [
      { test: /\.ts.?$/, loader: 'ts-loader' },
      { test: /\.glsl$/, loader: 'raw-loader' }
    ]
  }
}