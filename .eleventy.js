const fs = require("fs");
const { promisify } = require("util");

const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const htmlmin = require('html-minifier');
const { JSDOM } = require("jsdom");
const csso = require("csso");
const sizeOf = promisify(require("image-size"));

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { cache } = require("eleventy-plugin-workbox");

const isProd = process.env.NODE_ENV === 'production';

module.exports = function(eleventyConfig) {
  // Minify HTML and CSS in production
  if (isProd) {
    eleventyConfig.addFilter('purifyCss', purifyCss);
    eleventyConfig.addTransform('htmlmin', minifyHTML);
  }

  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/posts");

  eleventyConfig.addPassthroughCopy('robots.txt');
  eleventyConfig.addPassthroughCopy('humans.txt');
  eleventyConfig.addPassthroughCopy('manifest.json');
  eleventyConfig.addPassthroughCopy('apple-touch-icon.jpg');
  eleventyConfig.addPassthroughCopy('favicon.ico');

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(cache, {
      enabled: isProd,
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL dd, yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj, sep='-') => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat(`yyyy${sep}LL${sep}dd`);
  });

  eleventyConfig.addFilter('urlize', (pageObj) => {
    const slug = pageObj.fileSlug;
    const dt = DateTime.fromJSDate(pageObj.date, {zone: 'utc'}).toFormat(`yyyy/LL`);
    const url = `/${dt}/${slug}.html`;
    return url;
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  }

  function copyright() {
    const y = new Date().getFullYear();
    return `2013–${y}`;
  }

  eleventyConfig.addFilter("filterTagList", filterTagList)

  // copyright filter
  eleventyConfig.addShortcode('copyright', copyright);

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  eleventyConfig.addTransform("imgDim", dimImages);

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/",

    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};

function purifyCss(content) {

  const REGEX = {
    whitespace: /\s+/g,
    urlHexPairs: /%[\dA-F]{2}/g,
    quotes: /"/g,
  }

  function collapseWhitespace(str) {
    return str.trim().replace(REGEX.whitespace, ' ');
  }
  
  function dataURIPayload(string) {
    return encodeURIComponent(string)
      .replace(REGEX.urlHexPairs, specialHexEncode);
  }

  function specialHexEncode(match) {
    switch (match) { // Browsers tolerate these characters, and they're frequent
      case '%20': return ' ';
      case '%3D': return '=';
      case '%3A': return ':';
      case '%2F': return '/';
      default: return match.toLowerCase(); // compresses better
    }
  }

  function svgToTinyDataUri(svgString) {
    if (typeof svgString !== 'string') {
      throw new TypeError('Expected a string, but received ' + typeof svgString);
    }
    // Strip the Byte-Order Mark if the SVG has one
    if (svgString.charCodeAt(0) === 0xfeff) { svgString = svgString.slice(1) }
  
    const body = collapseWhitespace(svgString).replace(REGEX.quotes, "'");
    return 'data:image/svg+xml,' + dataURIPayload(body);
  }

  const svgs = [
    'prev',
    'next',
    'tag',
  ]
  svgs.map((svg) => (
    content = content.replace(
      `../img/${svg}.svg`,
      svgToTinyDataUri(fs.readFileSync(`./assets/img/${svg}.svg`).toString())
  )));

  const after = csso.minify(content).css;

  return after;
}

function minifyHTML(content, outputPath) {
  return outputPath.endsWith('.html')
    ? htmlmin.minify(content, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      })
    : content
}

const dimImages = async (rawContent, outputPath) => {
  let content = rawContent;

  if (outputPath && outputPath.endsWith(".html")) {
    const dom = new JSDOM(content);
    const images = [...dom.window.document.querySelectorAll("img")];


    if (images.length > 0) {
      await Promise.all(images.map((i) => processImage(i, outputPath)));
      content = dom.serialize();
    }
  }

  return content;
};

/**
 * Sets `width` and `height` on each image, adds blurry placeholder
 * and generates a srcset if none present.
 * Note, that the static `sizes` string would need to change for a different
 * blog layout.
 */
const processImage = async (img, outputPath) => {
  let src = img.getAttribute("src");
  if (/^(https?\:\/\/|\/\/)/i.test(src)) {
    return;
  }
  if (/^\.+\//.test(src)) {
    // resolve relative URL
    src =
      "/" +
      path.relative("./_site/", path.resolve(path.dirname(outputPath), src));
    if (path.sep == "\\") {
      src = src.replace(/\\/g, "/");
    }
  }
  let dimensions;

  try {
    dimensions = await sizeOf(`_site${src}`);
  } catch (e) {
    console.warn(e.message, src);
    return;
  }
  if (!img.getAttribute("width")) {
    img.setAttribute("width", dimensions.width);
    img.setAttribute("height", dimensions.height);
  }
  const inputType = dimensions.type;
  if (inputType == "svg") {
    return;
  }

  if (img.tagName == "IMG") {
    img.setAttribute("decoding", "async");
    img.setAttribute("loading", "lazy");

    img.setAttribute("src", src);
  }
};