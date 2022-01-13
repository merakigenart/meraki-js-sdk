// @ts-nocheck

//import { generateRandomTokenData } from './helpers';

export class Random {
    protected state: Record<string, any>;
    protected seedValues: Record<string, any>;

    prngA;
    prngB;
    useA = false;

    constructor(public tokenData = { tokenHash: '', tokenId: '' }) {
        this.useA = false;
        const sfc32 = class {
            handler;
            constructor(uint128Hex) {
                let a = parseInt(uint128Hex.substr(0, 8), 16);
                let b = parseInt(uint128Hex.substr(8, 8), 16);
                let c = parseInt(uint128Hex.substr(16, 8), 16);
                let d = parseInt(uint128Hex.substr(24, 8), 16);

                this.handler = function (seed = 4294967296) {
                    if (seed === undefined) {
                        seed = 4294967296;
                    }

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
                    return (t >>> 0) / seed;
                };
            }
        };

        const hashPartLength = (tokenData.tokenHash.length - 2) / 2;

        // const seedStr = tokenData.tokenHash.slice(2);
        // const seeds = [];

        // for(let i = 0; i <= 64; i++) {
        //     seeds.push(seedStr.substring(i, 4));
        //     i += 4;
        // }

        // seed prngA with first half of tokenData.hash
        this.prngA = new sfc32(tokenData.tokenHash.substring(2, hashPartLength)).handler;
        // seed prngB with second half of tokenData.hash
        this.prngB = new sfc32(tokenData.tokenHash.substring(hashPartLength + 2, hashPartLength)).handler;

        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }

        //this.tokenData.tokenHash = generateRandomTokenData(2).tokenHash;

        this.state = this.initializeState().state;
        this.seedValues = this.initializeSeeds(this.generateSeeds(this.tokenData.tokenHash));
        this.rnd();
    }

    // random number between 0 (inclusive) and 1 (exclusive)
    decimal() {
        return this.rnd();
    }

    // random number between a (inclusive) and b (exclusive)
    number(a = undefined, b = undefined) {
        if (a === undefined) {
            a = 0;
        }

        if (b === undefined) {
            b = Number.MAX_VALUE - 2;
        }

        return a + (b - a) * this.decimal();
    }

    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    integer(a = undefined, b = undefined) {
        if (a === undefined) {
            a = 0;
        }

        if (b === undefined) {
            b = Number.MAX_VALUE - 2;
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

    generateSeeds(str: string): number[] {
        let part = 0;
        const seeds: number[] = [];

        if (str.startsWith('0x')) {
            str = str.slice(2);
        }

        for (let i = 0; i < str.length; i++) {
            part = str.slice(i, i + 4);
            seeds.push(parseInt(part, 16));

            i += 4;
        }

        for (let i = 0; i < str.length; i++) {
            part = str.slice(i, i + 4);
            seeds.push(parseInt(part, 16));

            i += 2;
        }

        for (let i = 0; i < str.length; i++) {
            part = str.slice(i, i + 4);
            seeds.push(parseInt(part, 16));

            i += 1;
        }

        for (let i = 0; i < str.length; i++) {
            part = str.substring(str.length - i - 4, str.length - i);
            part = part.substring(2, 4) + part.substring(0, 2);
            seeds.push(parseInt(part, 16));
            i += 4;
        }

        return seeds;
    }

    protected initializeSeeds(seeds: number[]) {
        const seedValues = {
            eps: Math.pow(2, -32),
            m0: seeds.shift(),
            m1: seeds.shift(),
            m2: seeds.shift(),
            m3: seeds.shift(),
            a0: seeds.shift(),
            a1: seeds.shift(),
            a2: seeds.shift(),
            a3: seeds.shift(),
        };

        return seedValues;
    }

    protected initializeState(stateSize = 4, integerSize: 8 | 16 | 32 | 64 = 16) {
        const intMap = {
            8: Uint8Array,
            16: Uint16Array,
            32: Uint32Array,
            64: BigUint64Array,
        };

        const intClass = intMap[integerSize];
        const state = new intClass(stateSize);
        const dataView = new DataView(state.buffer);

        return {
            integerSize,
            stateSize,
            state,
            dataView,
        };
    }

    rnd() {
        const { eps, a0, a1, a2, a3, m0, m1, m2, m3 } = this.seedValues;

        const a = this.state[0],
            b = this.state[1],
            c = this.state[2],
            e = this.state[3],
            f = 0 | (a0 + m0 * a),
            g = 0 | (a1 + m0 * b + (m1 * a + (f >>> 16))),
            h = 0 | (a2 + m0 * c + m1 * b + (m2 * a + (g >>> 16)));

        this.state[0] = f;
        this.state[1] = g;
        this.state[2] = h;
        this.state[3] = a3 + m0 * e + (m1 * c + m2 * b) + (m3 * a + (h >>> 16));

        const i = (e << 21) + (((e >> 2) ^ c) << 5) + (((c >> 2) ^ b) >> 11);

        return eps * (((i >>> (e >> 11)) | (i << (31 & -(e >> 11)))) >>> 0);
    }
}
