import gulp from 'gulp';
import runSequence from 'run-sequence';

export default () =>
  gulp.task('default', (cb) => runSequence('clean', 'test', cb))
;
