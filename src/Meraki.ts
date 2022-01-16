/* eslint-disable no-undef */

import config from '@/config';
import { murmurhash3 } from '@/lib/murmurhash3';
import { sha256 } from '@/lib/sha256';
import { MerakiScript } from '@/MerakiScript';
import { Random } from '@/Random';
import { chunkify } from '@/helpers';

export interface Dimensions {
    height: number;
    width: number;
}

export interface MerakiTokenData {
    tokenHash: string;
    tokenId: string;
    mintedAt: number | string;
}

// @ts-ignore
const win: Record<any, any> = window || globalThis || {};

export class Meraki {
    protected tokenData: MerakiTokenData = {
        tokenHash: '',
        tokenId: '',
        mintedAt: 0,
    };

    protected registerScriptCalled = false;

    protected randomObj!: Random;

    get random() {
        return this.randomObj;
    }

    get data() {
        return Object.assign({}, this.tokenData);
    }

    get utils() {
        return {
            hash: {
                murmurhash3,
                sha256,
            },
            chunkify,
        };
    }

    get canvas(): Dimensions {
        return {
            height: win.innerHeight,
            width: win.innerWidth,
        };
    }

    get window(): Dimensions {
        return {
            height: win.innerHeight,
            width: win.innerWidth,
        };
    }

    get hasScriptRegistered() {
        return this.registerScriptCalled;
    }

    public registerScript(scriptObject: MerakiScript): MerakiScript {
        this.registerScriptCalled = true;

        globalThis[config.scriptInstanceName] = scriptObject; // eslint-disable-line no-undef

        return scriptObject;
    }

    public tokenAgeInSeconds() {
        return (new Date().getTime() - parseInt(`${this.data.mintedAt}`)) / 1000;
    }

    public isScriptRegistered() {
        return this.registerScriptCalled;
    }

    constructor(tokenId: string, hash: string) {
        this.tokenData.tokenId = tokenId;
        this.tokenData.tokenHash = hash;
        this.registerScriptCalled = false;

        this.randomObj = new Random(this.tokenData);
    }
}
