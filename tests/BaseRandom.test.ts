/* eslint-disable no-undef */
import { BaseRandom } from '@/BaseRandom';

let baseRandom: BaseRandom;

beforeEach(() => {
    baseRandom = new BaseRandom({ tokenHash: '0x140dca7574424322a3d01d1271ac33a4960cbb62213a43225ef08d25533af123', tokenId: '123' });
});

it('returns different values for different tokens', () => {
    const random1a = baseRandom.integer(0, 50);
    const random1b = baseRandom.integer(0, 50);

    const baseRandom2 = new BaseRandom({ tokenHash: '0x940cca72744643225ef08d17711cb873940cca72744643225ef08d17711cb873', tokenId: '123' });
    const random2a = baseRandom2.integer(0, 50);
    const random2b = baseRandom2.integer(0, 50);

    expect(random1a).not.toEqual(random1b);
    expect(random2a).not.toEqual(random2b);
    expect(random1a).not.toEqual(random2a);
    expect(random1b).not.toEqual(random2b);
});

it('returns the same series of random values for each token', () => {
    baseRandom = new BaseRandom({ tokenHash: '0x140dca7574424322a3d01d1271ac33a4960cbb62213a43225ef08d25533af123', tokenId: '123' });
    const random1 = [baseRandom.integer(0, 50), baseRandom.integer(0, 50), baseRandom.integer(0, 50)];

    baseRandom = new BaseRandom({ tokenHash: '0x140dca7574424322a3d01d1271ac33a4960cbb62213a43225ef08d25533af123', tokenId: '123' });
    const random2 = [baseRandom.integer(0, 50), baseRandom.integer(0, 50), baseRandom.integer(0, 50)];

    baseRandom = new BaseRandom({ tokenHash: '0x3a1fd2ac74424323a3d0131271ac33a4963cbb62313a43225e308d26311dc456', tokenId: '123' });
    const random3 = [baseRandom.integer(0, 50), baseRandom.integer(0, 50), baseRandom.integer(0, 50)];

    expect(random1).toStrictEqual(random2);
    expect(random1).not.toStrictEqual(random3);
});

it('shuffles an array of numbers', () => {
    const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const result1 = baseRandom.shuffle(array1);
    const result2 = baseRandom.shuffle(array2);

    expect(result1).not.toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result1).not.toStrictEqual(result2);
});
