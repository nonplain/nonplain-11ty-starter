module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("../files");

  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};
