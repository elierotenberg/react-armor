import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import rimraf from 'rimraf';

import babelConfig from './babelConfig';

gulp.task('clean', (done) =>
  rimraf('./dist', done)
);

gulp.task('lint', () =>
  gulp.src('src/**/*.jsx')
  .pipe(plumber())
  .pipe(eslint())
  .pipe(eslint.format())
);

gulp.task('build', ['lint'], () =>
  gulp.src('src/**/*.jsx')
  .pipe(sourcemaps.init())
  .pipe(babel(babelConfig))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist'))
);

gulp.task('test', ['build'], () =>
  gulp.src('dist/**/__tests__/**/*.js')
  .pipe(mocha())
);

gulp.task('default', ['test']);
