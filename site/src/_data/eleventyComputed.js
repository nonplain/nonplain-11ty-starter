module.exports = {
  eleventyNavigation: data => data.file && data.file.metadata.eleventyNavigation ? data.file.metadata.eleventyNavigation : {},
  title: data => data.file
    ? data.file.metadata.title
    : data.title,
};
