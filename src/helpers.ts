import { MerakiScript } from '@/MerakiScript';
import config from '@/config';

export const registerScript = (scriptObject: MerakiScript): MerakiScript => {
    globalThis[config.scriptInstanceName] = scriptObject; // eslint-disable-line no-undef

    return scriptObject;
};
