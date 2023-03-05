import path from 'path';
import { readFile } from 'fs/promises';
import { BuildResult } from 'esbuild';
import { preparePaths } from './prepare-paths';

export const renderHtml = async (buildResult: BuildResult): Promise<string> => {
  const outputsFileKeys = buildResult.metafile?.outputs || {};
  const [jsFiles, cssFiles] = preparePaths(Object.keys(outputsFileKeys));

  // Prepare html with <scripts ...></scripts>'s
  const jsFilesInjectHtml = `${jsFiles?.map((src: string) => `<script src="${src}"></script>`)}`;

  // Prepare html with <link ...>'s
  const cssFilesInjectHtml = `${cssFiles?.map((href: string) => `<link href="${href}" rel="stylesheet" />`)}`;

  // eslint-disable-next-line no-useless-catch
  try {
    let template = (await readFile(path.resolve(__dirname, '..', '..', '..', 'demo-stand', 'index.html'), {
      encoding: 'utf8',
    })) as string;

    // Inject css files
    const indexOfCloseHeadTag = template.indexOf('</head>');
    template =
      template.substring(0, indexOfCloseHeadTag) + cssFilesInjectHtml + template.substring(indexOfCloseHeadTag);

    // Inject js files
    const indexOfCloseBodyTag = template.indexOf('</body>');
    template = template.substring(0, indexOfCloseBodyTag) + jsFilesInjectHtml + template.substring(indexOfCloseBodyTag);
    return template;
  } catch (err) {
    throw err;
  }
};
