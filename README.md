# webpack-sane-compiler-notifier

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[npm-url]:https://npmjs.org/package/webpack-sane-compiler-notifier
[npm-image]:http://img.shields.io/npm/v/webpack-sane-compiler-notifier.svg
[downloads-image]:http://img.shields.io/npm/dm/webpack-sane-compiler-notifier.svg
[travis-url]:https://travis-ci.org/moxystudio/webpack-sane-compiler-notifier
[travis-image]:http://img.shields.io/travis/moxystudio/webpack-sane-compiler-notifier/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/webpack-sane-compiler-notifier
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/webpack-sane-compiler-notifier/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/webpack-sane-compiler-notifier
[david-dm-image]:https://img.shields.io/david/moxystudio/webpack-sane-compiler-notifier.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/webpack-sane-compiler-notifier?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/webpack-sane-compiler-notifier.svg
[greenkeeper-image]:https://badges.greenkeeper.io/moxystudio/webpack-sane-compiler-notifier.svg
[greenkeeper-url]:https://greenkeeper.io

Notify webpack compilation status to your operating system when using [webpack-sane-compiler](https://github.com/moxystudio/webpack-sane-compiler).


## Installation

`$ npm install webpack-sane-compiler-notifier --save-dev`


## Usage

```js
const startNotifying = require('webpack-sane-compiler-notifier');

const stopNotifying = startNotifying(compiler, {/* options */});

// Call compiler.run() or compiler.watch() to start a compilation and you will see OS notifications showing up
// Additionally, calling stopNotifying() will stop listening to the compiler events
```

### Available options:

| Name   | Description   | Type     | Default |
| ------ | ------------- | -------- | ------- |
| title | The title for the notification | string | package.json `name` |
| icon | The icon for the notification | string | [webpack-logo.png](webpack-logo.png) |
| sound | Play a sound when notifying on OS that support it | string | false |


## Tests

`$ npm test`   
`$ npm test -- --watch` during development


## License

[MIT License](http://opensource.org/licenses/MIT)
