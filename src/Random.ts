/* eslint-disable no-unused-vars */
// @ts-nocheck

//import { generateRandomTokenData } from './helpers';

export class Random {
    protected state: Record<string, any>;
    protected seedValues: Record<string, any>;

    constructor(public tokenData = { tokenHash: '', tokenId: '' }) {
        if (this.tokenData.tokenHash === '') {
            this.tokenData.tokenHash = '0x940cca72744643225ef08d17711cb873940cca72744643225ef08d17711cb873';
        }

        const seeds = this.generateSeeds(this.tokenData.tokenHash);

        this.state = this.initializeState().state;
        this.seedValues = this.initializeSeeds(seeds);
        this.rnd();
    }

    // random number between 0 (inclusive) and 1 (exclusive)
    decimal() {
        return this.rnd();
    }

    // random number between a (inclusive) and b (exclusive)
    number(a = undefined, b = undefined) {
        if (a === undefined && b === undefined) {
            a = 0;
            b = Number.MAX_VALUE - 2;
        }

        if (b === undefined) {
            b = a;
            a = 0;
        }

        if (a === undefined) {
            a = 0;
        }

        return a + (b - a) * this.decimal();
    }

    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    integer(a = undefined, b = undefined) {
        if (a === undefined && b === undefined) {
            a = 0;
            b = Number.MAX_VALUE - 2;
        }

        if (b === undefined) {
            b = a;
            a = 0;
        }

        if (a === undefined) {
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

    generateSeeds(str: string): number[] {
        let part = 0;
        const seeds: number[] = [];

        str = `${str}`;

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
        const seedValues = Object.assign(
            {},
            {
                eps: Math.pow(2, -32),
                m0: seeds[0],
                m1: seeds[1],
                m2: seeds[2],
                m3: seeds[3],
                a0: seeds[4],
                a1: seeds[5],
                a2: seeds[6],
                a3: seeds[7],
            },
        );

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

    shuffle(a: any[]) {
        const f = [...a];
        let b,
            c,
            e = a.length;

        for (let i = 0; i < e; i++) {
            b = ~~(this.rnd() * e - 1);
            c = f[e];
            f[e] = f[b];
            f[b] = c;
            e--;
        }

        return f;
    }
}
