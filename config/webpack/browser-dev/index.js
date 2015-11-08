import path from 'path';
import webpack from 'webpack';

export default {
  context: path.join(__dirname, '..', '..', '..'),
  target: 'web',
  debug: true,
  devtool: 'eval',
  output: {
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          ignore: ['node_modules', 'dist'],
          presets: ['./config/babel/browser-dev'],
          sourceMaps: 'inline',
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
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
