export abstract class MerakiScriptTraits {
    traitNames() {
        // @ts-ignore
        return Object.getOwnPropertyNames(this.prototype).filter(name => !['constructor', 'traitNames'].includes(name));
    }
}
