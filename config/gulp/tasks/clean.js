import gulp from 'gulp';
import path from 'path';
import rimraf from 'rimraf';

const dist = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
  'dist', // /dist
);

export default () =>
  gulp.task('clean', (cb) => rimraf(dist, cb))
;
