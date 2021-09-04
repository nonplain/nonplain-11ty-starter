const buildFiles = require("./buildFiles");

module.exports = function (eleventyConfig) {
  /* Watch nonplain files */
  eleventyConfig.addWatchTarget("../files");

  let changed = [];
  eleventyConfig.on('beforeWatch', (changedFiles) => {
    changed = changedFiles;
  });

  eleventyConfig.on('beforeBuild', () => {
    /* Prevent build cycle */
    const isFilesJsonChange =
      changed.length === 1 && changed[0].includes('files.json');

    if (changed.length > 0 && !isFilesJsonChange) {
      buildFiles();
    }
  });

  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};
