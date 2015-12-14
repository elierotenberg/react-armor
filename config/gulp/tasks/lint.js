import eslint from 'gulp-eslint';
import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';

const app = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
  'app', // /app/
);

export default () =>
  gulp.task('lint', () => gulp.src(app)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
  )
;
