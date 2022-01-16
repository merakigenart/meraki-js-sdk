// @ts-nocheck
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Meraki } from './Meraki';
import { MerakiScript } from './MerakiScript';
import { generateNewSdkTemplate } from './Utilities';
import { generateRandomTokenData } from './helpers';

const merakiSdk = {
    Meraki: Meraki,
    MerakiScript,
    generateNewSdkTemplate,
    generateRandomTokenData,
};

window.Meraki = tokenData => {
    window.Meraki = new merakiSdk.Meraki(tokenData.tokenId, tokenData.tokenHash);
};

globalThis.MerakiScript = merakiSdk.MerakiScript;
globalThis.merakiSdk = merakiSdk;

globalThis.merakiRender = () => {
    globalThis.tokenScript.render();
};

globalThis.registerScript = merakiSdk.Meraki.registerScript;

function setup() {
    // eslint-disable-line no-unused-vars
    globalThis.tokenScript.render();
}

// const DEFAULT_SIZE = 1000
// const WIDTH = globalThis.innerWidth
// const HEIGHT = globalThis.innerHeight
// const DIM = Math.min(WIDTH, HEIGHT)
// const MULTIPLIER = DIM / DEFAULT_SIZE

// function setup() {
//   createCanvas(WIDTH, HEIGHT)
//   rect(100*MULTIPLIER, 500*MULTIPLIER, 50*MULTIPLIER, 50*MULTIPLIER)
// }
