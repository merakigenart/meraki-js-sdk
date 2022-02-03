/* eslint-disable no-undef */

import { Meraki } from '@/Meraki';
import { MerakiScript } from '@/MerakiScript';
import { generateRandomTokenData } from './helpers';

export const sdk = {
    Meraki,
    MerakiScript,
    generateRandomTokenData,
    // @ts-ignore
    version: __APP_VERSION__,
};

export default sdk;
