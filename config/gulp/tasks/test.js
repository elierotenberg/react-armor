import gulp from 'gulp';
import mocha from 'gulp-mocha';
import path from 'path';
import through2 from 'through2';
import runSequence from 'run-sequence';

import babelConfig from '../../babel';

const root = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
);

const dist = path.join(root, 'dist');

function sync(cb) {
  return through2.obj((data, enc, f) => f(), (f) => { f(); cb(); });
}

function createTest(platform, env) {
  return (cb) => {
    gulp.src(path.join(dist, platform, env, '**', '__tests__', '**', '*.js'), { read: false })
      .pipe(mocha({ reporter: 'spec' }))
      .pipe(sync(cb));
  };
}

export default () => {
  const platforms = Object.keys(babelConfig);
  platforms.forEach((platform) => {
    const envs = Object.keys(babelConfig[platform]);
    envs.forEach((env) =>
      gulp.task(`test-${platform}-${env}`, [`build-${platform}-${env}`], createTest(platform, env))
    );
  });
  gulp.task('test-browser', (cb) => runSequence('test-browser-dev', 'test-browser-prod', cb));
  gulp.task('test-node', (cb) => runSequence('test-node-dev', 'test-node-prod', cb));
  gulp.task('test', (cb) => runSequence('test-browser', 'test-node', cb));
};
