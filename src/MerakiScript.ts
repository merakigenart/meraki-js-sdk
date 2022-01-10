export const createArtworkScript = (scriptObject: MerakiScript): MerakiScript => {
    // @ts-ignore
    window.tokenScript = scriptObject; // eslint-disable-line no-undef

    return scriptObject;
};

export interface MerakiScriptConfiguration {
    renderTimeMs?: number;
    library?: {
        name?: string;
        version?: string;
    };
}

export abstract class MerakiScript {
    public abstract execute(): void;
    public abstract configure(): MerakiScriptConfiguration;

    public initialize() {
        //
    }

    public finalize() {
        //
    }

    public render() {
        this.initialize();
        this.execute();
        this.finalize();
    }
}
