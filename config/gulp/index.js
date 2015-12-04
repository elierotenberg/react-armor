import eslint from 'gulp-eslint';
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import plumber from 'gulp-plumber';
import rimraf from 'rimraf';
import path from 'path';
import webpack from 'webpack';

import webpackBrowserDev from '../webpack/browser-dev';
import webpackBrowserProd from '../webpack/browser-prod';
import webpackNodeDev from '../webpack/node-dev';
import webpackNodeProd from '../webpack/node-prod';

const exts = ['js', 'jsx'];
const src = 'src';
const sources = exts.map((ext) => path.join(src, '**', `*.${ext}`));
const dist = 'dist';
const __tests__ = '__tests__';
const tests = exts.map((ext) => path.join(src, __tests__, '**', `*.${ext}`));

gulp.task('clean', (done) =>
  rimraf(dist, done)
);

gulp.task('lint', () =>
  gulp.src(sources)
  .pipe(plumber())
  .pipe(eslint())
  .pipe(eslint.format())
);

function build(webpackConfig) {
  return (cb) => webpack(webpackConfig, (err) => !err || cb(err));
}

gulp.task('build-browser-dev', ['clean', 'lint'], build(webpackBrowserDev));

gulp.task('build-browser-prod', ['clean', 'lint'], build(webpackBrowserProd));

gulp.task('build-node-dev', ['clean', 'lint'], build(webpackNodeDev));

gulp.task('build-node-prod', ['clean', 'lint'], build(webpackNodeProd));

gulp.task('build', ['test', 'build-node-dev', 'build-node-prod', 'build-browser-dev', 'build-browser-prod']);

gulp.task('test', () =>
  gulp.src(tests, { read: false })
  .pipe(mocha())
);

gulp.task('default', ['build']);
