import path from 'path';
import webpack from 'webpack';

export default {
  context: path.join(__dirname, '..', '..', '..'),
  target: 'node',
  debug: false,
  devtool: 'cheap-inline-source-map',
  output: {
    filename: 'index.min.js',
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
          presets: ['./config/babel/node-prod'],
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: { except: ['GeneratorFunction'] },
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  externals: [
    /^[a-z\-0-9]+$/,
  ],
};
