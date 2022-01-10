/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import { Meraki } from './Meraki';
import { MerakiScript } from './MerakiScript';
import { createArtworkScript } from './MerakiScript';

class Script extends MerakiScript {
    execute() {
        const random1 = Meraki.random.integer();
        const random2 = Meraki.random.integer();

        createCanvas(windowWidth, windowHeight);

        fill(234, 31, 81);
        noStroke();

        rect(55, 55, 250, 250);
        fill(255);

        textSize(14);
        text('hello world', 50, 250);
    }

    initialize() {
        //called prior to execution
    }

    configure() {
        return {
            renderDelayMs: 100,
            libraryName: 'p5',
            libraryVersion: '1.4.0',
        };
    }
}

// You must call createArtworkScript() to properly setup the class instance
createArtworkScript(new Script());
