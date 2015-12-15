import babel from 'gulp-babel';
import changed from 'gulp-changed';
import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';

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

const misc = sources.map((source) => `!${source}`).concat(path.join(app, '**', '*'));

const dist = path.join(root, 'dist');

function createCopy(platform, env) {
  return () => gulp.src(misc)
  .pipe(changed(path.join(dist, platform, env, 'app'), { hasChanged: changed.compareSha1Digest }))
  .pipe(gulp.dest(path.join(dist, platform, env, 'app')));
}

function createBuild(platform, env) {
  return () => gulp.src(sources)
    .pipe(plumber({
      errorHandler: (err) => console.error(err.stack),
    }))
    .pipe(changed(path.join(dist, platform, env, 'app'), { extension: '.js', hasChanged: changed.compareSha1Digest }))
    .pipe(babel(Object.assign({}, babelConfig[platform][env], { sourceMaps: 'both', retainLines: true })))
    .pipe(gulp.dest(path.join(dist, platform, env, 'app')))
  ;
}

export default () => {
  gulp.task('build', Object.keys(babelConfig).map((platform) => {
    const buildPlatformTaskName = `build-${platform}`;
    gulp.task(buildPlatformTaskName, Object.keys(babelConfig[platform]).map((env) => {
      const buildEnvTaskName = `build-${platform}-${env}`;
      const copyEnvTaskName = `copy-${platform}-${env}`;
      gulp.task(copyEnvTaskName, [`clean-${platform}-${env}`], createCopy(platform, env));
      gulp.task(buildEnvTaskName, [copyEnvTaskName, 'lint'], createBuild(platform, env));
      return buildEnvTaskName;
    }));
    return buildPlatformTaskName;
  }));
};
