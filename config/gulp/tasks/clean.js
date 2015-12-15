import gulp from 'gulp';
import path from 'path';
import rimraf from 'rimraf';

import babelConfig from '../../babel';

const dist = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
  'dist', // /dist
);

export default () => {
  const platforms = Object.keys(babelConfig);
  platforms.forEach((platform) => {
    const envs = Object.keys(babelConfig[platform]);
    envs.forEach((env) =>
      gulp.task(`clean-${platform}-${env}`, (cb) => rimraf(path.join(dist, platform, env), cb))
    );
  });
  gulp.task('clean', (cb) => rimraf(dist, cb));
};
