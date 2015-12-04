require('source-map-support/register');
require('babel-register')({
  ignore: ['node_modules', 'dist'],
  presets: ['./config/babel/node-dev'],
});
require('./config/gulp');
