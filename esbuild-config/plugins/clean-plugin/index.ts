import { rm } from 'fs/promises';
import { Plugin } from 'esbuild';

export const CleanPlugin: Plugin = {
  name: 'clean-plugin',
  setup(build) {
    build.onStart(async () => {
      try {
        await rm(build.initialOptions.outdir, { recursive: true });
      } catch (err) {
        /* noop */
      }
    });
  },
};
