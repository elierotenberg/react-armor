import eslint from 'gulp-eslint';
import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';

const app = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
  'lib', // /lib/
  '**',
);

const exts = ['js', 'jsx'];

export default () =>
  gulp.task('lint', () => gulp.src(exts.map((ext) => path.join(app, `.${ext}`)))
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
  )
;
