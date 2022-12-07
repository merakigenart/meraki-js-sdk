import fisherYatesShuffle from '@/lib/shuffle';

export class BaseRandom {
    public useA = false;
    public prngA: () => number;
    public prngB: () => number;

    constructor(public tokenData = { tokenHash: '', tokenId: '' }) {
        const sfc32 = function (uint128Hex) {
            let a = parseInt(uint128Hex.substr(0, 8), 16);
            let b = parseInt(uint128Hex.substr(8, 8), 16);
            let c = parseInt(uint128Hex.substr(16, 8), 16);
            let d = parseInt(uint128Hex.substr(24, 8), 16);
            return function () {
                a |= 0;
                b |= 0;
                c |= 0;
                d |= 0;
                const t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };

        if (typeof tokenData.tokenHash !== 'string') {
            // @ts-ignore
            tokenData.tokenHash = `0x${tokenData.tokenHash.toString(16)}`;
        }

        // seed prngA with first half of tokenData.hash
        // @ts-ignore
        this.prngA = new sfc32(tokenData.tokenHash.substring(2, 32));
        // seed prngB with second half of tokenData.hash
        // @ts-ignore
        this.prngB = new sfc32(tokenData.tokenHash.substring(34, 32));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }

    // random number between 0 (inclusive) and 1 (exclusive)
    decimal() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }

    // random number between a (inclusive) and b (exclusive)
    number(a: number, b: number | undefined = undefined) {
        if (b === undefined) {
            b = a;
            a = 0;
        }

        return a + (b - a) * this.decimal();
    }

    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    integer(a: number, b: number | undefined = undefined) {
        if (b === undefined) {
            b = a;
            a = 0;
        }

        return Math.floor(this.number(a, b + 1));
    }

    // random boolean with p as percent likelihood of true
    boolean(p = 50) {
        return this.decimal() < p * 0.1;
    }

    // random value in an array of items
    element(list) {
        return list[this.integer(0, list.length - 1)];
    }

    // shuffle an array of items using the Fisher-Yates algorithm
    shuffle(list) {
        return fisherYatesShuffle(() => this.decimal(), list);
    }
}
