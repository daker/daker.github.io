module.exports = {
  globDirectory: '_site/',
  globPatterns: [
    '**/*.{html,css,json,xml,avif,jpeg,webp,png,jpg,js,mjs}',
  ],
  ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
  swDest: '_site/service-worker.js',
}
