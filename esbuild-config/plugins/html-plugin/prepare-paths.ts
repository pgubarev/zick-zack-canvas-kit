export const preparePaths = (outputsFileKeys: string[]) =>
  outputsFileKeys.reduce<Array<string[]>>(
    (acc, path) => {
      const [jsFiles, cssFiles] = acc;
      const fileName = path.split('/').pop();

      if (fileName?.endsWith('.js')) {
        jsFiles.push(fileName);
      } else if (fileName?.endsWith('.css')) {
        cssFiles.push(fileName);
      }

      return [jsFiles, cssFiles];
    },
    [[], []],
  );
