export function generateNewSdkTemplate(): string {
    // the template uses '|||' as a placeholder to ensure that the empty lines is not removed.
    // this is done so we can set the location of the editor cursor to the correct position.
    return `
// Your class must extend the MerakiScript class
class Script extends MerakiScript {
    execute() {
        // p5 setup() and draw() code here
        |||
    }

    configure() {
        return {
            renderDelayMs: 50,
            libraryName: 'p5',
            libraryVersion: '1.4.0',
        }
    }
}

// You must call createArtworkScript() to properly setup the class instance
createArtworkScript(new Script());
`
        .replace('|||', '')
        .trim();
}
