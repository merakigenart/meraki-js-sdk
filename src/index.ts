/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

console.log('hello world');

import { Meraki } from './Meraki';
import { MerakiScript, createArtworkScript } from './MerakiScript';

const window: Record<string, any> = globalThis || {};

window.Meraki = new Meraki('tokenId', 'hash');
window.MerakiScript = MerakiScript;

window.merakiRender = () => {
    window.tokenScript.render();
};

window.createArtworkScript = createArtworkScript;

function setup() {
    // eslint-disable-line no-unused-vars
    window.tokenScript.render();
}

// //called prior to execution

// const DEFAULT_SIZE = 1000
// const WIDTH = globalThis.innerWidth
// const HEIGHT = globalThis.innerHeight
// const DIM = Math.min(WIDTH, HEIGHT)
// const MULTIPLIER = DIM / DEFAULT_SIZE

// function setup() {
//   createCanvas(WIDTH, HEIGHT)
//   rect(100*MULTIPLIER, 500*MULTIPLIER, 50*MULTIPLIER, 50*MULTIPLIER)
// }
