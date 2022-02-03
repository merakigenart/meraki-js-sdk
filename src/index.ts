/* eslint-disable no-undef */
import { Meraki } from './Meraki';
import { MerakiScript } from './MerakiScript';
import { generateNewSdkTemplate } from './Utilities';
import { generateRandomTokenData } from './helpers';

const merakiSdk = {
    Meraki: Meraki,
    MerakiScript,
    generateNewSdkTemplate,
    generateRandomTokenData,
    // @ts-ignore
    version: __APP_VERSION__,
};

globalThis.Meraki = tokenData => {
    globalThis.Meraki = new merakiSdk.Meraki(tokenData.tokenId, tokenData.tokenHash);
};
globalThis.MerakiScript = merakiSdk.MerakiScript;
globalThis.merakiSdk = merakiSdk;
// @ts-ignore
globalThis.registerScript = merakiSdk.Meraki.registerScript;
