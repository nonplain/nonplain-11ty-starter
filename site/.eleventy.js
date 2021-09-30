const CleanCSS = require("clean-css");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const buildFiles = require("./build-files");

module.exports = function (eleventyConfig) {
  /* Plugins */
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  /* Filters */
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  /* Development daemon */
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

  /* Return */
  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};
