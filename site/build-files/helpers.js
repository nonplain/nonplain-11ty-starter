const path = require('path');
const URL = require('url').URL;

const Link = require('nonplain-md-link').default;
const { regex } = require('nonplain-md-link');
const slug = require('slug');

const FILES_ROOT = path.join(__dirname, '../../files');
const FILES_DATA = path.join(__dirname, '../src/_data/files.json');
const PUBLIC_EXTNAME = '.html';

function isFullUrl(href) {
  try {
    new URL(href);
    return true;
  } catch (err) {
    return false;
  }
}

/* Convert all links to HTML */
function markdownLinksToHTML({ content, file }) {
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
      /* Ensure internal links resolve properly on the server */
      link.path = resolveInternalLinkPath({ file, linkPath: link.path });
      return link.composeHTML();
    }
  });
}

function resolveInternalLinkPath({ file, linkPath }) {
  const destinationFile = path.parse(path.join(file.dir, linkPath));
  const destination = getPermalinkFromFile(destinationFile);

  return destination.replace('index' + path.extname(destination), '');
}

function getEleventyNavigation({ eleventyNavigation, file, permalink, title }) {
  const result = {
    key: slug(title),
    order: permalink == '/' ? 0 : 1,
    title,
  };

  const crumbStack = getCrumbStack(file);

  result.root = crumbStack[0];
  result.key = crumbStack.pop();
  result.parent = crumbStack.pop();

  return {
    ...result,
    ...eleventyNavigation,
  };
}

function getCrumbStack(file) {
  const sitepath = getPermalinkFromFile(file);
  const extname = path.extname(sitepath);

  return sitepath
    .replace('index' + extname, '')
    .replace(extname, '')
    .split('/')
    .filter(Boolean);
}

function getPermalinkFromFile(file) {
  const root = file.dir.replace(FILES_ROOT, '') + '/';

  let page = file.name;
  if (page !== 'index') {
    page = path.join(page, 'index');
  }

  return path.join(root, page + PUBLIC_EXTNAME);
}

module.exports = {
  FILES_DATA,
  FILES_ROOT,
  getEleventyNavigation,
  getPermalinkFromFile,
  markdownLinksToHTML,
};
