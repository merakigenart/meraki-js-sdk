import { MerakiScript } from '@/MerakiScript';
import config from '@/config';

export const registerScript = (scriptObject: MerakiScript): MerakiScript => {
    globalThis[config.scriptInstanceName] = scriptObject; // eslint-disable-line no-undef

    return scriptObject;
};

export const generateRandomTokenData = (projectNum = 0) => {
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

/**
 * Separates string into chunks of the same size
 *
 * @param {string} str - string to separate into chunks
 * @param {int} size - number of characters wanted in each chunk
 * @return {array} - array of original string split into chunks
 *
 * @example
 *      chunkify("this is a test", 2)
 */
export function chunkify(str: string, size: number): string[] {
    const chunks: string[] = [];

    for (let i = 0; i < str.length; i += size) {
        chunks.push(str.slice(i, i + size));
    }

    return chunks;
}
