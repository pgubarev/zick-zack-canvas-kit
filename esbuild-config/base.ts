import path from 'path';
import { BuildOptions } from 'esbuild';
import * as dotenv from 'dotenv';
import { CleanPlugin } from './plugins/clean-plugin';
import { HtmlPlugin } from './plugins/html-plugin';
import { EnvPlugin } from './plugins/env-plugin';

dotenv.config();

function resolveRoot(...segments: string[]): string {
  return path.resolve(__dirname, '..', ...segments);
}

const config: BuildOptions = {
  tsconfig: resolveRoot('tsconfig.json'),
  outdir: resolveRoot('build'),
  entryPoints: [resolveRoot('src', 'index.ts')],
  entryNames: '[dir]/bundle.[name]-[hash]',
  allowOverwrite: true,
  bundle: true,
  minify: false,
  sourcemap: false,
  metafile: true,
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
  },
  plugins: [EnvPlugin, CleanPlugin, HtmlPlugin],
};

export default config;
