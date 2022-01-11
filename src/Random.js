export class Random {
    prngA;
    prngB;

    constructor(tokenData = { hash: '', tokenId: '' }) {
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
        const hashPartLength = (tokenData.hash.length - 2) / 2;
        // seed prngA with first half of tokenData.hash
        this.prngA = new sfc32(tokenData.hash.substr(2, hashPartLength));
        // seed prngB with second half of tokenData.hash
        this.prngB = new sfc32(tokenData.hash.substr(hashPartLength + 2, hashPartLength));

        for (let i = 0; i < 1e6; i += 2) {
            this.prngA.handler();
            this.prngB.handler();
        }
    }

    // random number between 0 (inclusive) and 1 (exclusive)
    randomDecimal() {
        this.useA = !this.useA;
        return this.useA ? this.prngA.handler() : this.prngB.handler();
    }

    // random number between a (inclusive) and b (exclusive)
    randomNumber(a, b) {
        return a + (b - a) * this.randomDecimal();
    }

    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    randomInteger(a, b) {
        return Math.floor(this.randomNumber(a, b + 1));
    }

    // random boolean with p as percent likelihood of true
    randomBoolean(p = 50) {
        return this.randomDecimal() < p * 0.1;
    }

    // random value in an array of items
    randomElement(list) {
        return list[this.randomInteger(0, list.length - 1)];
    }
}
