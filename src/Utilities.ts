export function generateNewSdkTemplate(): string {
    // the template uses '|||' as a placeholder to ensure that the empty lines is not removed.
    // this is done so we can set the location of the editor cursor to the correct position.
    return `
class Script extends MerakiScript {
    execute() {
        // p5 setup() code here
        |||
    }

    draw() {
        super.draw();
        // p5 draw() code here
    }

    initialize() {
        super.initialize();
        // p5 preload() code here
    }

    configure() {
        return {
            renderTimeMs: 50,
            sdkVersion: '1.1.0',
            library: {
                name: 'p5',
                version: '1.4.0',
            }
        }
    }

    traits() {
        return {};
    }
}
`
        .replace('|||', '')
        .trim();
}

export { generateRandomTokenData } from './helpers';
