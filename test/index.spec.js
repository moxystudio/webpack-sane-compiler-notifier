'use strict';

const path = require('path');
const EventEmitter = require('events');
const readPkgUp = require('read-pkg-up');
const notifier = require('node-notifier');
const startNotifying = require('..');

jest.mock('node-notifier', () => ({
    notify: jest.fn(),
}));

const title = readPkgUp.sync().pkg.name;
const contentImage = path.resolve(__dirname, '../webpack-logo.png');
const sound = false;

beforeEach(jest.clearAllMocks);

it('should report a build success', () => {
    const saneCompiler = new EventEmitter();

    startNotifying(saneCompiler);
    saneCompiler.emit('begin');
    saneCompiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(notifier.notify.mock.calls[0][0]).toMatchObject({
        title,
        contentImage,
        sound: false,
        message: 'Build successful',
    });
});

it('should report a build error', () => {
    const saneCompiler = new EventEmitter();

    startNotifying(saneCompiler);
    saneCompiler.emit('begin');
    saneCompiler.emit('error', new Error('foo'));

    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(notifier.notify.mock.calls[0][0]).toMatchObject({
        title,
        contentImage,
        sound,
    });
    expect(notifier.notify.mock.calls[0][0].message).toMatch('foo');
});

it('should not report subsequent successful builds', () => {
    const saneCompiler = new EventEmitter();

    startNotifying(saneCompiler);
    saneCompiler.emit('begin');
    saneCompiler.emit('end');
    saneCompiler.emit('begin');
    saneCompiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(1);
});

it('should report a successful build after a failed one', () => {
    const saneCompiler = new EventEmitter();

    startNotifying(saneCompiler);
    saneCompiler.emit('begin');
    saneCompiler.emit('error', new Error('foo'));
    saneCompiler.emit('begin');
    saneCompiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(2);
    expect(notifier.notify.mock.calls[0][0].message).toMatch('foo');
    expect(notifier.notify.mock.calls[1][0].message).toMatch('Build successful');
});

it('should allow a custom title, icon and sound options', () => {
    const saneCompiler = new EventEmitter();

    startNotifying(saneCompiler, {
        title: 'foo',
        icon: 'bar',
        sound: true,
    });
    saneCompiler.emit('begin');
    saneCompiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(notifier.notify.mock.calls[0][0]).toMatchObject({
        title: 'foo',
        contentImage: 'bar',
        sound: true,
        message: 'Build successful',
    });
});

it('should stop notifying if stopNotifying was called', () => {
    const saneCompiler = new EventEmitter();

    const stopNotifying = startNotifying(saneCompiler, {
        title: 'foo',
        icon: 'bar',
        sound: true,
    });

    stopNotifying();

    saneCompiler.emit('begin');
    saneCompiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(0);
});
