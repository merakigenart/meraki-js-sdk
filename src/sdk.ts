import { Meraki } from '@/Meraki';
import { MerakiScript } from '@/MerakiScript';
import { generateRandomTokenData } from './helpers';
//import * as utils from '@/Utilities';

export const sdk = {
    Meraki,
    MerakiScript,
    generateRandomTokenData,
};

export default sdk;
