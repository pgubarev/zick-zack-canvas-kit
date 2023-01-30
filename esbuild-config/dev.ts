import ESBuild from 'esbuild';
import liveServer from 'live-server';
import config from './base';

const port = Number(process.env.PORT) || 3000;

liveServer.start({
  port,
  host: 'localhost',
  root: 'build',
  open: false,
  ignore: 'node_modules',
  file: 'index.html',
  wait: 1000,
});

ESBuild.build({
  ...config,
  watch: {
    onRebuild(error) {
      if (error) console.error('Watch build failed!');
      else console.log('Watch build succeeded!');
    },
  },
})
  .then(() => {
    console.log('Watching...');
  })
  .catch((err) => {
    console.log(err);
  });
