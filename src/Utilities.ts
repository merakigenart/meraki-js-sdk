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

    version() {
        return '0.0.1';
    }

    configure() {
        return {
            renderTimeMs: 50,
            library: {
                name: 'p5',
                version: '1.4.0',
            }
        }
    }
}

Meraki.registerScript(new Script());
`
        .replace('|||', '')
        .trim();
}
