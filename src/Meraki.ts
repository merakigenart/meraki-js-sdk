/* eslint-disable no-undef */

import { Random } from '@/Random';

export interface MerakiCanvasInformation {
    height: number;
    width: number;
}

export class Meraki {
    protected tokenData: Record<string, any> = {
        hash: '',
        tokenId: '',
    };

    protected randomObj: Random;

    get random() {
        // @ts-ignore
        return new Random(this.tokenData);
    }

    get data() {
        return Object.assign({}, this.tokenData);
    }

    get canvas() {
        return {
            height: globalThis.innerHeight,
            width: globalThis.innerWidth,
        };
    }

    constructor(tokenId: string, hash: string) {
        this.tokenData.tokenId = tokenId;
        this.tokenData.hash = hash;
        // // @ts-ignore
        // this.randomObj = new Random(this.tokenData);
    }
}
