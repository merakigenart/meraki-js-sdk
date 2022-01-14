/* eslint-disable no-undef */
import { sdk } from '@/sdk';

const tokenData = sdk.utils.generateRandomTokenData();

window.sdk = sdk;
window.tokenId = tokenData.tokenId;
window.tokenHash = tokenData.tokenHash;
window.tokenData = tokenData;
