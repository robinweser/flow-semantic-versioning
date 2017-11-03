var path = require('path')

var generateLockFilePlugin = require('../modules/generateLockFilePlugin')

module.exports = {
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          plugins: [generateLockFilePlugin, 'transform-flow-strip-types']
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
}
