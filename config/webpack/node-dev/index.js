import path from 'path';
import webpack from 'webpack';

export default {
  context: path.join(__dirname, '..', '..', '..'),
  target: 'node',
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
          presets: ['./config/babel/node-dev'],
          sourceMaps: 'inline',
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
