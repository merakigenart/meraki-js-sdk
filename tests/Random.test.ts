/* eslint-disable no-undef */

import { Random } from '@/Random';

let random: Random;

beforeEach(() => {
    random = new Random({ tokenId: '123', tokenHash: '0x940cca72744643225ef08d17711cb873940cca72744643225ef08d17711cb873' });
});

it('generates a random integer', () => {
    expect(random.integer()).toBeGreaterThanOrEqual(0);
});

it('generates a random decimal', () => {
    expect(random.decimal()).toBeGreaterThanOrEqual(0.0);
});

it('generates a random boolean', () => {
    expect(typeof random.boolean()).toBe('boolean');
});

it('generates random decimals', () => {
    const decimal1 = random.decimal();
    const decimal2 = random.decimal();

    expect(decimal1).not.toEqual(decimal2);
});

it('generates predictable seeds based on a provided value', () => {
    expect(random.generateSeeds('940cca72744643225ef08d17711cb873')).toMatchSnapshot();
    expect(random.generateSeeds('0x940cca72744643225ef08d17711cb873')).toMatchSnapshot();
    expect(random.generateSeeds('0x67a03e8e37010be33328144dc723c6b7')).toMatchSnapshot();
    expect(random.generateSeeds('0x1234567890')).toMatchSnapshot();
});
