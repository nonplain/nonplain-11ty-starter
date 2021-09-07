const path = require('path');
const URL = require('url').URL;
const slug = require('slug');

const Files = require('nonplain').default;
const Link = require('nonplain-md-link').default;
const { regex } = require('nonplain-md-link');

/* If URL is an absolute path, we assume it's external */
function isFullUrl(href) {
  try {
    new URL(href);
    return true;
  } catch (err) {
    return false;
  }
}

/* Convert all links to HTML */
function markdownLinksToHTML(content) {
  return content.replace(regex.links.all, (linkStr) => {
    /* Instantiate Link for the current match */
    const link = new Link(linkStr);

    /* If link is an absolute path, we assume it's external */
    const isExternalUrl = isFullUrl(link.path);

    /*
     * We add an arrow decoration and some special attributes to external links.
     * Otherwise, we just return a normal <a/> element.
     */
    if (isExternalUrl) {
      const externalLinkArrow = '&#x2197;';
      link.innerText = link.innerText + ' ' + externalLinkArrow;

      return link.composeHTML('rel="noreferrer" target="_blank"');
    } else {
      return link.composeHTML();
    }
  });
}

function buildFiles() {
  /* Hack for easy logging */
  const print = console.log.bind(console, 'files-build:');

  print('Building files...');

  /* Load all files into Files instance using glob */
  const files = new Files().load('../files/**/*.md');

  /* Transform the files as necessary for the 11ty build */
  files.transform(({ body, metadata }) => {
    /* Convert all links to HTML */
    const newBody = markdownLinksToHTML(body);

    /* Add a valid permalink for each file */
    const newMetadata = {
      ...metadata,
      permalink: metadata.permalink || '/' + slug(metadata.title) + '/',
    };

    return {
      body: newBody,
      metadata: newMetadata,
    };
  });

  /* Export Files instance to JSON where 11ty can use it */
  files.export2JSON('src/_data/files.json');

  print('Done!', '\n');
}

module.exports = buildFiles;
