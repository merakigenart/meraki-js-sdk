export class Random {
    prngA;
    prngB;

    constructor(tokenData = { tokenHash: '', tokenId: '' }) {
        this.useA = false;
        let sfc32 = class {
            handler;
            constructor(uint128Hex) {
                let a = parseInt(uint128Hex.substr(0, 8), 16);
                let b = parseInt(uint128Hex.substr(8, 8), 16);
                let c = parseInt(uint128Hex.substr(16, 8), 16);
                let d = parseInt(uint128Hex.substr(24, 8), 16);

                this.handler = function () {
                    a |= 0;
                    b |= 0;
                    c |= 0;
                    d |= 0;
                    let t = (((a + b) | 0) + d) | 0;
                    d = (d + 1) | 0;
                    a = b ^ (b >>> 9);
                    b = (c + (c << 3)) | 0;
                    c = (c << 21) | (c >>> 11);
                    c = (c + t) | 0;
                    return (t >>> 0) / 4294967296;
                };
            }
        };
        const hashPartLength = (tokenData.tokenHash.length - 2) / 2;
        console.log('hashPartLength', hashPartLength);

        // seed prngA with first half of tokenData.hash
        this.prngA = new sfc32(tokenData.tokenHash.substr(2, hashPartLength)).handler;
        // seed prngB with second half of tokenData.hash
        this.prngB = new sfc32(tokenData.tokenHash.substr(hashPartLength + 2, hashPartLength)).handler;

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
    number(a, b) {
        if (a === undefined) {
            a = 0;
        }

        if (b === undefined) {
            b = Number.MAX_VALUE;
        }

        return a + (b - a) * this.decimal();
    }

    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    integer(a, b) {
        if (a === undefined) {
            a = 0;
        }

        if (b === undefined) {
            b = Number.MAX_VALUE;
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
}
