const path = require('path');

const Files = require('nonplain').default;

const {
  FILES_DATA,
  FILES_ROOT,
  getEleventyNavigation,
  getPermalinkFromFile,
  markdownLinksToHTML,
} = require('./helpers');

function buildFiles() {
  /* Hack for easy logging */
  const print = console.log.bind(console);

  print('Building files...');

  /* Load all files into Files instance using glob */
  const files = new Files().load(path.join(FILES_ROOT, '/**/*.md'));

  /* Transform the files as necessary for the 11ty build */
  files.transform(({ body, metadata }) => {
    print(' ├ ', metadata.title, ':', path.join(metadata.file.dir, metadata.file.base));

    /* Convert all links to HTML */
    const newBody = markdownLinksToHTML({ content: body, file: metadata.file });

    /* Add a valid permalink and navigation data for each file */
    const newMetadata = {
      eleventyNavigation: getEleventyNavigation(metadata),
      permalink: getPermalinkFromFile(metadata.file),
      ...metadata,
    };

    return {
      body: newBody,
      metadata: newMetadata,
    };
  });

  /* Export Files instance to JSON where 11ty can use it */
  files.export2JSON(FILES_DATA);

  print('Done!', '\n');
}

module.exports = buildFiles;
