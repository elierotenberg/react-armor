import path from 'path';
import webpack from 'webpack';

export default {
  entry: path.join(__dirname, '..', '..', '..', 'src', 'index.js'),
  context: path.join(__dirname, '..', '..', '..'),
  target: 'web',
  debug: true,
  devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, '..', '..', '..', 'dist', 'browser'),
    filename: 'index.js',
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
          presets: ['./config/babel/browser-dev'],
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  node: {
    console: true,
    global: true,
    process: 'mock',
    Buffer: true,
    __filename: 'mock',
    __dirname: 'mock',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
