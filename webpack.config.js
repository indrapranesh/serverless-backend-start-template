const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  // devtool: 'source-map',
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      loader: 'ts-loader'
    }, ],
  },
  optimization: {
    minimize: false
  }
};