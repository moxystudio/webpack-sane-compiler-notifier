'use strict';

const path = require('path');
const EventEmitter = require('events');
const readPkgUp = require('read-pkg-up');
const notifier = require('node-notifier');
const serializer = require('jest-serializer-path');
const startNotifying = require('..');

expect.addSnapshotSerializer(serializer);

jest.mock('node-notifier', () => ({
    notify: jest.fn(),
}));

const title = readPkgUp.sync().pkg.name;
const contentImage = path.resolve(__dirname, '../webpack-logo.png');
const sound = false;

beforeEach(jest.clearAllMocks);

it('should report a build success', () => {
    const compiler = new EventEmitter();

    startNotifying(compiler);
    compiler.emit('begin');
    compiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(notifier.notify.mock.calls[0][0]).toMatchObject({
        title,
        contentImage,
        sound: false,
        message: 'Build successful',
    });
});

it('should report a build error', () => {
    const compiler = new EventEmitter();

    startNotifying(compiler);
    compiler.emit('begin');
    compiler.emit('error', new Error('foo'));

    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(notifier.notify.mock.calls[0][0]).toMatchObject({
        title,
        contentImage,
        sound,
    });
    expect(notifier.notify.mock.calls[0][0].message).toMatch('foo');
});

it('should not report subsequent successful builds', () => {
    const compiler = new EventEmitter();

    startNotifying(compiler);
    compiler.emit('begin');
    compiler.emit('end');
    compiler.emit('begin');
    compiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(1);
});

it('should report a successful build after a failed one', () => {
    const compiler = new EventEmitter();

    startNotifying(compiler);
    compiler.emit('begin');
    compiler.emit('error', new Error('foo'));
    compiler.emit('begin');
    compiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(2);
    expect(notifier.notify.mock.calls[0][0].message).toMatch('foo');
    expect(notifier.notify.mock.calls[1][0].message).toMatch('Build successful');
});

it('should allow a custom title, icon and sound options', () => {
    const compiler = new EventEmitter();

    startNotifying(compiler, {
        title: 'foo',
        icon: 'bar',
        sound: true,
    });
    compiler.emit('begin');
    compiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(notifier.notify.mock.calls[0][0]).toMatchObject({
        title: 'foo',
        contentImage: 'bar',
        sound: true,
        message: 'Build successful',
    });
});

it('should stop notifying if stopNotifying was called', () => {
    const compiler = new EventEmitter();

    const { stop } = startNotifying(compiler, {
        title: 'foo',
        icon: 'bar',
        sound: true,
    });

    stop();

    compiler.emit('begin');
    compiler.emit('end');

    expect(notifier.notify).toHaveBeenCalledTimes(0);
});

it('should provide the internal options', () => {
    const compiler = new EventEmitter();

    const { options } = startNotifying(compiler, { title: 'foo' });

    expect(options).toMatchSnapshot();
});
