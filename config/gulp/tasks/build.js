import babel from 'gulp-babel';
import changed from 'gulp-changed';
import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';

import babelConfig from '../../babel';

const root = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
);

const app = path.join(root, 'app');

const sources = [
  path.join(app, '**', '*.jsx'),
  path.join(app, '**', '*.js'),
];

const dist = path.join(root, 'dist');

function createBuild(platform, env) {
  return () => gulp.src(sources)
    .pipe(plumber({
      errorHandler: (err) => console.error(err.stack),
    }))
    .pipe(changed(dist, { extension: '.js', hasChanged: changed.compareSha1Digest }))
    .pipe(sourcemaps.init())
    .pipe(babel(babelConfig[platform][env]))
    .pipe(sourcemaps.write(path.join(dist, platform, env, '__maps__')))
    .pipe(gulp.dest(path.join(dist, platform, env, 'app')))
  ;
}

export default () => {
  gulp.task('build', Object.keys(babelConfig).map((platform) => {
    const buildPlatformTaskName = `build-${platform}`;
    gulp.task(buildPlatformTaskName, Object.keys(babelConfig[platform]).map((env) => {
      const buildEnvTaskName = `build-${platform}-${env}`;
      gulp.task(buildEnvTaskName, createBuild(platform, env));
      return buildEnvTaskName;
    }));
    return buildPlatformTaskName;
  }));
};
