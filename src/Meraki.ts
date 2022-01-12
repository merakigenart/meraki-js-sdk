/* eslint-disable no-undef */

import config from '@/config';
import { murmurhash3 } from '@/lib/murmurhash3';
import { MerakiScript } from '@/MerakiScript';
import { Random } from '@/Random';

export interface MerakiCanvasInformation {
    height: number;
    width: number;
}

export class Meraki {
    protected tokenData: Record<string, any> = {
        tokenHash: '',
        tokenId: '',
    };

    protected registerScriptCalled = false;

    protected randomObj!: Random;

    get random() {
        // @ts-ignore
        return new Random(this.tokenData);
    }

    get data() {
        return Object.assign({}, this.tokenData);
    }

    get utils() {
        return {
            hash: {
                murmurhash3,
            },
        };
    }

    get canvas() {
        return {
            height: globalThis.innerHeight,
            width: globalThis.innerWidth,
        };
    }

    public registerScript(scriptObject: MerakiScript): MerakiScript {
        this.registerScriptCalled = true;

        globalThis[config.scriptInstanceName] = scriptObject; // eslint-disable-line no-undef

        return scriptObject;
    }

    isScriptRegistered() {
        return this.registerScriptCalled;
    }

    constructor(tokenId: string, hash: string) {
        this.tokenData.tokenId = tokenId;
        this.tokenData.tokenHash = hash;
        this.registerScriptCalled = false;

        // // @ts-ignore
        // this.randomObj = new Random(this.tokenData);
    }
}
