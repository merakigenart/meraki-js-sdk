/* eslint-disable no-undef */

import { Random } from '@/Random';
import config from './config';
import { MerakiScript } from './MerakiScript';

export interface MerakiCanvasInformation {
    height: number;
    width: number;
}

export class Meraki {
    protected tokenData: Record<string, any> = {
        tokenHash: '',
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

    public registerScript(scriptObject: MerakiScript): MerakiScript {
        globalThis[config.scriptInstanceName] = scriptObject; // eslint-disable-line no-undef

        return scriptObject;
    }

    constructor(tokenId: string, hash: string) {
        this.tokenData.tokenId = tokenId;
        this.tokenData.tokenHash = hash;
        // // @ts-ignore
        // this.randomObj = new Random(this.tokenData);
    }
}
