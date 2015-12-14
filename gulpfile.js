require('babel-register')({
  only: ['config'],
  presets: ['./config/babel/node/dev'],
  retainLines: true,
});
require('babel-polyfill');
require('./config/gulp');
