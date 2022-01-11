/* eslint-disable no-undef */

import { Random } from '@/Random';

let random: Random;

beforeEach(() => {
    random = new Random({ tokenId: '123', tokenHash: '123' });
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
