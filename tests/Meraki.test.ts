/* eslint-disable no-undef */

import { Meraki, win } from '@/Meraki';

const createLocationObject = (url: string) => {
    const parsed = new URL(url);

    return {
        ancestorOrigins: {},
        href: parsed.href,
        origin: parsed.origin,
        protocol: parsed.protocol,
        host: parsed.host,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
    };
};

it('logs to the console when log() is called during a test render', () => {
    win['location'] = createLocationObject(
        'https://mraki.io/projects/test?randomSeed=0x768fb1b12235f8f95c5a9d736e1f966c3e02d6b3738f8b03349ff433daa8dffa',
    );

    const meraki = new Meraki('1', '0x768fb1b12235f8f95c5a9d736e1f966c3e02d6b3738f8b03349ff433daa8dffa');
    const spy = jest.spyOn(console, 'log');
    spy.mockReset();

    meraki.log('test string 1');

    expect(spy).toHaveBeenCalledWith('test string 1');
    expect(spy).toHaveBeenCalledTimes(1);
});

it('logs to the console when log() is called from testnet', () => {
    win['location'] = createLocationObject(
        'https://testnets.mraki.io/projects/test?randomSeed=0x768fb1b12235f8f95c5a9d736e1f966c3e02d6b3738f8b03349ff433daa8dffa',
    );

    const meraki = new Meraki('1', '0x768fb1b12235f8f95c5a9d736e1f966c3e02d6b3738f8b03349ff433daa8dffa');
    const spy = jest.spyOn(console, 'log');
    spy.mockReset();

    meraki.log('test string 2');

    expect(spy).toHaveBeenCalledWith('test string 2');
    expect(spy).toHaveBeenCalledTimes(1);
});

it('does not log to the console when log() is called from render', () => {
    win['location'] = createLocationObject(
        'https://mraki.io/token/1/1?randomSeed=0x768fb1b12235f8f95c5a9d736e1f966c3e02d6b3738f8b03349ff433daa8dffa',
    );

    const meraki = new Meraki('1', '0x768fb1b12235f8f95c5a9d736e1f966c3e02d6b3738f8b03349ff433daa8dffa');
    const spy = jest.spyOn(console, 'log');
    spy.mockReset();

    meraki.log('test string 3');

    expect(spy).toHaveBeenCalledTimes(0);
});
