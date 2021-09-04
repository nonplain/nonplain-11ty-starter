module.exports = {
  title: data => data.file
    ? data.file.metadata.title
    : data.title,
};
