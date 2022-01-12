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

    public abstract version(): string;

    public draw() {
        //
    }

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
