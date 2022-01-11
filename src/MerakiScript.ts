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

    public draw: CallableFunction | null = null;

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
