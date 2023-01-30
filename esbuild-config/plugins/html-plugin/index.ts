import path from 'path';
import { writeFile } from 'fs/promises';
import { BuildResult, Plugin } from 'esbuild';
import { renderHtml } from './render-html';

export const HtmlPlugin: Plugin = {
  name: 'html-plugin',
  setup(build) {
    build.onEnd(async (buildResult: BuildResult) => {
      try {
        await writeFile(path.resolve(build.initialOptions.outdir, 'index.html'), await renderHtml(buildResult));
      } catch (err) {
        console.log(err);
      }
    });
  },
};
