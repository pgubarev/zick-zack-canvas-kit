import ESBuild from 'esbuild';
import config from './base';

ESBuild.build({
  ...config,
  minify: true,
  sourcemap: true,
});
