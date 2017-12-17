'use strict';

const path = require('path');
const os = require('os');
const notifier = require('node-notifier');
const readPkgUp = require('read-pkg-up');
const stripAnsi = require('strip-ansi');
const { renderers } = require('webpack-sane-compiler-reporter');

let defaultTitle;

function getDefaultTitle() {
    if (!defaultTitle) {
        /* istanbul ignore next */
        defaultTitle = readPkgUp.sync().pkg.name || 'Unknown project';
    }

    return defaultTitle;
}

function createNotifier({ title, icon, sound }) {
    // On osx, omit the icon because it will be cut off in the notification center
    const omitIcon = os.platform() === 'darwin';

    return (message) => notifier.notify({
        title,
        message,
        contentImage: icon,
        icon: omitIcon ? undefined : icon,
        sound,
    });
}

function startNotifying(compiler, options) {
    options = Object.assign({
        title: undefined,
        icon: path.join(__dirname, 'webpack-logo.png'),
        sound: false,
    }, options);

    // Read the default title only if not set to avoid doing unnecessary I/O
    options.title = options.title || getDefaultTitle();

    let lastBuildSucceeded = false;
    const notify = createNotifier(options);

    const onError = (err) => {
        lastBuildSucceeded = false;

        const message = stripAnsi(renderers.error(err));

        notify(message);
    };

    const onEnd = () => {
        if (!lastBuildSucceeded) {
            lastBuildSucceeded = true;
            notify('Build successful');
        }
    };

    const stopNotifying = () => {
        compiler
        .removeListener('end', onEnd)
        .removeListener('error', onError);
    };

    compiler
    .on('error', onError)
    .on('end', onEnd);

    return {
        stop: stopNotifying,
        options,
    };
}

module.exports = startNotifying;
