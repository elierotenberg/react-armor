import path from 'path';
import webpack from 'webpack';

export default {
  context: path.join(__dirname, '..', '..', '..'),
  target: 'node',
  debug: true,
  devtool: 'eval-source-map',
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          ignore: ['node_modules', 'dist'],
          presets: ['./config/babel/node-dev'],
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  externals: [
    /^[a-z\-0-9]+$/,
  ],
};
