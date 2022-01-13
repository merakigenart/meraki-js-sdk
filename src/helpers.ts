import { MerakiScript } from '@/MerakiScript';
import config from '@/config';

export const registerScript = (scriptObject: MerakiScript): MerakiScript => {
    globalThis[config.scriptInstanceName] = scriptObject; // eslint-disable-line no-undef

    return scriptObject;
};

export const generateRandomTokenData = (projectNum: number) => {
    const data = {
        tokenHash: '',
        tokenId: '',
    };

    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += Math.floor(Math.random() * 16).toString(16);
    }

    data.tokenHash = hash;
    data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();

    return data;
};
