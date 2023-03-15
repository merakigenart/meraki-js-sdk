"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/sdk.ts
var sdk_exports = {};
__export(sdk_exports, {
  default: () => sdk_default,
  sdk: () => sdk
});
module.exports = __toCommonJS(sdk_exports);

// src/config.ts
var config = {
  scriptInstanceName: "tokenScript"
};
var config_default = config;

// src/lib/murmurhash3.ts
var strToBuf = TextEncoder.prototype.encode.bind(new TextEncoder());
var hexLUT = Array.from({ length: 256 }, (_, i) => `00${i.toString(16)}`.slice(-2));
function bufToHex(buf = new Uint8Array(0)) {
  let str = "";
  for (let i = 0; i < buf.byteLength; i++) {
    str += hexLUT[buf[i]];
  }
  return str;
}
function mul32(m, n) {
  return (m & 65535) * n + (((m >>> 16) * n & 65535) << 16);
}
function rol32(n, r) {
  return n << r | n >>> 32 - r;
}
function add64(m, n) {
  const ms = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535];
  const ns = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
  const os = [0, 0, 0, 0];
  os[3] += ms[3] + ns[3];
  os[2] += os[3] >>> 16;
  os[3] &= 65535;
  os[2] += ms[2] + ns[2];
  os[1] += os[2] >>> 16;
  os[2] &= 65535;
  os[1] += ms[1] + ns[1];
  os[0] += os[1] >>> 16;
  os[1] &= 65535;
  os[0] += ms[0] + ns[0];
  os[0] &= 65535;
  return [os[0] << 16 | os[1], os[2] << 16 | os[3]];
}
function mul64(m, n) {
  const ms = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535];
  const ns = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
  const os = [0, 0, 0, 0];
  os[3] += ms[3] * ns[3];
  os[2] += os[3] >>> 16;
  os[3] &= 65535;
  os[2] += ms[2] * ns[3];
  os[1] += os[2] >>> 16;
  os[2] &= 65535;
  os[2] += ms[3] * ns[2];
  os[1] += os[2] >>> 16;
  os[2] &= 65535;
  os[1] += ms[1] * ns[3];
  os[0] += os[1] >>> 16;
  os[1] &= 65535;
  os[1] += ms[2] * ns[2];
  os[0] += os[1] >>> 16;
  os[1] &= 65535;
  os[1] += ms[3] * ns[1];
  os[0] += os[1] >>> 16;
  os[1] &= 65535;
  os[0] += ms[0] * ns[3] + ms[1] * ns[2] + ms[2] * ns[1] + ms[3] * ns[0];
  os[0] &= 65535;
  return [os[0] << 16 | os[1], os[2] << 16 | os[3]];
}
function rol64(n, r) {
  r %= 64;
  if (r === 32) {
    return [n[1], n[0]];
  } else if (r < 32) {
    return [n[0] << r | n[1] >>> 32 - r, n[1] << r | n[0] >>> 32 - r];
  } else {
    r -= 32;
    return [n[1] << r | n[0] >>> 32 - r, n[0] << r | n[1] >>> 32 - r];
  }
}
function shl64(n, s) {
  s %= 64;
  if (s === 0) {
    return n;
  } else if (s < 32) {
    return [n[0] << s | n[1] >>> 32 - s, n[1] << s];
  } else {
    return [n[1] << s - 32, 0];
  }
}
function xor64(a, b) {
  return [a[0] ^ b[0], a[1] ^ b[1]];
}
function x86fmix32(h) {
  h ^= h >>> 16;
  h = mul32(h, 2246822507);
  h ^= h >>> 13;
  h = mul32(h, 3266489909);
  h ^= h >>> 16;
  return h;
}
var x86hash32c1 = 3432918353;
var x86hash32c2 = 461845907;
function x86mix32(h, k) {
  k = mul32(k, x86hash32c1);
  k = rol32(k, 15);
  k = mul32(k, x86hash32c2);
  h ^= k;
  h = rol32(h, 13);
  h = mul32(h, 5) + 3864292196;
  return h;
}
function x86hash32(buf = new Uint8Array(0), state = 0, finalize = true) {
  if (typeof buf === "string") {
    buf = strToBuf(buf);
  }
  let h1;
  let i;
  let len;
  if (typeof state === "number") {
    h1 = state;
    i = 0;
    len = 0;
  } else {
    ({ h1, len } = state);
    const rem = state.rem;
    if (rem.byteLength === 0) {
      i = 0;
    } else if (rem.byteLength + buf.byteLength >= 4) {
      len += 4;
      i = 4 - rem.byteLength;
      const blk = new Uint8Array(4);
      const dtv2 = new DataView(blk.buffer);
      blk.set(rem);
      blk.set(buf.subarray(0, i), rem.byteLength);
      h1 = x86mix32(h1, dtv2.getUint32(0, true));
    } else {
      const newBuf = new Uint8Array(buf.byteLength + rem.byteLength);
      newBuf.set(rem);
      newBuf.set(buf, rem.byteLength);
      buf = newBuf;
      i = 0;
    }
  }
  const dtv = new DataView(buf.buffer, buf.byteOffset);
  const remainder = (buf.byteLength - i) % 4;
  const bytes = buf.byteLength - i - remainder;
  len += bytes;
  for (; i < bytes; i += 4) {
    h1 = x86mix32(h1, dtv.getUint32(i, true));
  }
  if (!finalize) {
    return {
      h1,
      len,
      rem: buf.slice(buf.byteLength - remainder)
    };
  } else {
    len += remainder;
    let k1 = 0;
    switch (remainder) {
      case 3:
        k1 ^= buf[i + 2] << 16;
      case 2:
        k1 ^= buf[i + 1] << 8;
      case 1:
        k1 ^= buf[i];
        k1 = mul32(k1, x86hash32c1);
        k1 = rol32(k1, 15);
        k1 = mul32(k1, x86hash32c2);
        h1 ^= k1;
    }
    h1 ^= len & 4294967295;
    h1 = x86fmix32(h1);
    return h1 >>> 0;
  }
}
var x86hash128c1 = 597399067;
var x86hash128c2 = 2869860233;
var x86hash128c3 = 951274213;
var x86hash128c4 = 2716044179;
function x86mix128(h1, h2, h3, h4, k1, k2, k3, k4) {
  k1 = mul32(k1, x86hash128c1);
  k1 = rol32(k1, 15);
  k1 = mul32(k1, x86hash128c2);
  h1 ^= k1;
  h1 = rol32(h1, 19);
  h1 += h2;
  h1 = mul32(h1, 5) + 1444728091;
  k2 = mul32(k2, x86hash128c2);
  k2 = rol32(k2, 16);
  k2 = mul32(k2, x86hash128c3);
  h2 ^= k2;
  h2 = rol32(h2, 17);
  h2 += h3;
  h2 = mul32(h2, 5) + 197830471;
  k3 = mul32(k3, x86hash128c3);
  k3 = rol32(k3, 17);
  k3 = mul32(k3, x86hash128c4);
  h3 ^= k3;
  h3 = rol32(h3, 15);
  h3 += h4;
  h3 = mul32(h3, 5) + 2530024501;
  k4 = mul32(k4, x86hash128c4);
  k4 = rol32(k4, 18);
  k4 = mul32(k4, x86hash128c1);
  h4 ^= k4;
  h4 = rol32(h4, 13);
  h4 += h1;
  h4 = mul32(h4, 5) + 850148119;
  return [h1, h2, h3, h4];
}
function x86hash128(buf = new Uint8Array(0), state = 0, finalize = true) {
  let str;
  if (typeof buf === "string") {
    buf = strToBuf(buf);
    str = true;
  } else {
    str = false;
  }
  let h1;
  let h2;
  let h3;
  let h4;
  let i;
  let len;
  if (typeof state === "number") {
    h1 = h2 = h3 = h4 = state;
    i = 0;
    len = 0;
  } else {
    ({ h1, h2, h3, h4, len } = state);
    const rem = state.rem;
    if (rem.byteLength === 0) {
      i = 0;
    } else if (rem.byteLength + buf.byteLength >= 16) {
      len += 16;
      i = 16 - rem.byteLength;
      const blk = new Uint8Array(16);
      const dtv2 = new DataView(blk.buffer);
      blk.set(rem);
      blk.set(buf.subarray(0, i), rem.byteLength);
      [h1, h2, h3, h4] = x86mix128(
        h1,
        h2,
        h3,
        h4,
        dtv2.getUint32(0, true),
        dtv2.getUint32(4, true),
        dtv2.getUint32(8, true),
        dtv2.getUint32(12, true)
      );
    } else {
      const newBuf = new Uint8Array(buf.byteLength + rem.byteLength);
      newBuf.set(rem);
      newBuf.set(buf, rem.byteLength);
      buf = newBuf;
      i = 0;
    }
  }
  const dtv = new DataView(buf.buffer, buf.byteOffset);
  const remainder = (buf.byteLength - i) % 16;
  const bytes = buf.byteLength - i - remainder;
  len += bytes;
  for (; i < bytes; i += 16) {
    [h1, h2, h3, h4] = x86mix128(
      h1,
      h2,
      h3,
      h4,
      dtv.getUint32(i, true),
      dtv.getUint32(i + 4, true),
      dtv.getUint32(i + 8, true),
      dtv.getUint32(i + 12, true)
    );
  }
  if (!finalize) {
    return {
      h1,
      h2,
      h3,
      h4,
      len,
      rem: buf.subarray(buf.byteLength - remainder)
    };
  } else {
    len += remainder;
    let k1 = 0;
    let k2 = 0;
    let k3 = 0;
    let k4 = 0;
    switch (remainder) {
      case 15:
        k4 ^= buf[i + 14] << 16;
      case 14:
        k4 ^= buf[i + 13] << 8;
      case 13:
        k4 ^= buf[i + 12];
        k4 = mul32(k4, x86hash128c4);
        k4 = rol32(k4, 18);
        k4 = mul32(k4, x86hash128c1);
        h4 ^= k4;
      case 12:
        k3 ^= buf[i + 11] << 24;
      case 11:
        k3 ^= buf[i + 10] << 16;
      case 10:
        k3 ^= buf[i + 9] << 8;
      case 9:
        k3 ^= buf[i + 8];
        k3 = mul32(k3, x86hash128c3);
        k3 = rol32(k3, 17);
        k3 = mul32(k3, x86hash128c4);
        h3 ^= k3;
      case 8:
        k2 ^= buf[i + 7] << 24;
      case 7:
        k2 ^= buf[i + 6] << 16;
      case 6:
        k2 ^= buf[i + 5] << 8;
      case 5:
        k2 ^= buf[i + 4];
        k2 = mul32(k2, x86hash128c2);
        k2 = rol32(k2, 16);
        k2 = mul32(k2, x86hash128c3);
        h2 ^= k2;
      case 4:
        k1 ^= buf[i + 3] << 24;
      case 3:
        k1 ^= buf[i + 2] << 16;
      case 2:
        k1 ^= buf[i + 1] << 8;
      case 1:
        k1 ^= buf[i];
        k1 = mul32(k1, x86hash128c1);
        k1 = rol32(k1, 15);
        k1 = mul32(k1, x86hash128c2);
        h1 ^= k1;
    }
    h1 ^= len & 4294967295;
    h2 ^= len & 4294967295;
    h3 ^= len & 4294967295;
    h4 ^= len & 4294967295;
    h1 += h2 + h3 + h4;
    h2 += h1;
    h3 += h1;
    h4 += h1;
    h1 = x86fmix32(h1);
    h2 = x86fmix32(h2);
    h3 = x86fmix32(h3);
    h4 = x86fmix32(h4);
    h1 += h2 + h3 + h4;
    h2 += h1;
    h3 += h1;
    h4 += h1;
    const hash = new DataView(new ArrayBuffer(16));
    hash.setUint32(0, h1, false);
    hash.setUint32(4, h2, false);
    hash.setUint32(8, h3, false);
    hash.setUint32(12, h4, false);
    return str ? bufToHex(new Uint8Array(hash.buffer)) : new Uint8Array(hash.buffer);
  }
}
function x64fmix64(h) {
  h = xor64(h, [0, h[0] >>> 1]);
  h = mul64(h, [4283543511, 3981806797]);
  h = xor64(h, [0, h[0] >>> 1]);
  h = mul64(h, [3301882366, 444984403]);
  h = xor64(h, [0, h[0] >>> 1]);
  return h;
}
var x64hash128c1 = [2277735313, 289559509];
var x64hash128c2 = [1291169091, 658871167];
function x64mix128(h1, h2, k1, k2) {
  k1 = mul64(k1, x64hash128c1);
  k1 = rol64(k1, 31);
  k1 = mul64(k1, x64hash128c2);
  h1 = xor64(h1, k1);
  h1 = rol64(h1, 27);
  h1 = add64(h1, h2);
  h1 = add64(mul64(h1, [0, 5]), [0, 1390208809]);
  k2 = mul64(k2, x64hash128c2);
  k2 = rol64(k2, 33);
  k2 = mul64(k2, x64hash128c1);
  h2 = xor64(h2, k2);
  h2 = rol64(h2, 31);
  h2 = add64(h2, h1);
  h2 = add64(mul64(h2, [0, 5]), [0, 944331445]);
  return [h1, h2];
}
function x64hash128(buf = new Uint8Array(0), state = 0, finalize = true) {
  let str;
  if (typeof buf === "string") {
    buf = strToBuf(buf);
    str = true;
  } else {
    str = false;
  }
  let h1;
  let h2;
  let i;
  let len;
  if (typeof state === "number") {
    h1 = [0, state];
    h2 = [0, state];
    i = 0;
    len = 0;
  } else {
    ({ h1, h2, len } = state);
    const rem = state.rem;
    if (rem.byteLength === 0) {
      i = 0;
    } else if (rem.byteLength + buf.byteLength >= 16) {
      len += 16;
      i = 16 - rem.byteLength;
      const blk = new Uint8Array(16);
      const dtv2 = new DataView(blk.buffer);
      blk.set(rem);
      blk.set(buf.subarray(0, i), rem.byteLength);
      [h1, h2] = x64mix128(
        h1,
        h2,
        [dtv2.getUint32(4, true), dtv2.getUint32(0, true)],
        [dtv2.getUint32(12, true), dtv2.getUint32(8, true)]
      );
    } else {
      const newBuf = new Uint8Array(buf.byteLength + rem.byteLength);
      newBuf.set(rem);
      newBuf.set(buf, rem.byteLength);
      buf = newBuf;
      i = 0;
    }
  }
  const dtv = new DataView(buf.buffer, buf.byteOffset);
  const remainder = (buf.byteLength - i) % 16;
  const bytes = buf.byteLength - i - remainder;
  len += bytes;
  for (; i < bytes; i += 16) {
    [h1, h2] = x64mix128(
      h1,
      h2,
      [dtv.getUint32(i + 4, true), dtv.getUint32(i, true)],
      [dtv.getUint32(i + 12, true), dtv.getUint32(i + 8, true)]
    );
  }
  if (!finalize) {
    return {
      h1,
      h2,
      len,
      rem: buf.subarray(buf.byteLength - remainder)
    };
  } else {
    len += remainder;
    let k1 = [0, 0];
    let k2 = [0, 0];
    switch (remainder) {
      case 15:
        k2 = xor64(k2, shl64([0, buf[i + 14]], 48));
      case 14:
        k2 = xor64(k2, shl64([0, buf[i + 13]], 40));
      case 13:
        k2 = xor64(k2, shl64([0, buf[i + 12]], 32));
      case 12:
        k2 = xor64(k2, shl64([0, buf[i + 11]], 24));
      case 11:
        k2 = xor64(k2, shl64([0, buf[i + 10]], 16));
      case 10:
        k2 = xor64(k2, shl64([0, buf[i + 9]], 8));
      case 9:
        k2 = xor64(k2, [0, buf[i + 8]]);
        k2 = mul64(k2, x64hash128c2);
        k2 = rol64(k2, 33);
        k2 = mul64(k2, x64hash128c1);
        h2 = xor64(h2, k2);
      case 8:
        k1 = xor64(k1, shl64([0, buf[i + 7]], 56));
      case 7:
        k1 = xor64(k1, shl64([0, buf[i + 6]], 48));
      case 6:
        k1 = xor64(k1, shl64([0, buf[i + 5]], 40));
      case 5:
        k1 = xor64(k1, shl64([0, buf[i + 4]], 32));
      case 4:
        k1 = xor64(k1, shl64([0, buf[i + 3]], 24));
      case 3:
        k1 = xor64(k1, shl64([0, buf[i + 2]], 16));
      case 2:
        k1 = xor64(k1, shl64([0, buf[i + 1]], 8));
      case 1:
        k1 = xor64(k1, [0, buf[i]]);
        k1 = mul64(k1, x64hash128c1);
        k1 = rol64(k1, 31);
        k1 = mul64(k1, x64hash128c2);
        h1 = xor64(h1, k1);
    }
    h1 = xor64(h1, [0, len & 4294967295]);
    h2 = xor64(h2, [0, len & 4294967295]);
    h1 = add64(h1, h2);
    h2 = add64(h2, h1);
    h1 = x64fmix64(h1);
    h2 = x64fmix64(h2);
    h1 = add64(h1, h2);
    h2 = add64(h2, h1);
    const hash = new DataView(new ArrayBuffer(16));
    hash.setUint32(0, h1[0], false);
    hash.setUint32(4, h1[1], false);
    hash.setUint32(8, h2[0], false);
    hash.setUint32(12, h2[1], false);
    return str ? bufToHex(new Uint8Array(hash.buffer)) : new Uint8Array(hash.buffer);
  }
}
var murmurhash3 = {
  hash32: x86hash32,
  hash128: x86hash128,
  x86: { hash32: x86hash32, hash128: x86hash128 },
  x64: { hash128: x64hash128 }
};
var murmurhash3_default = murmurhash3;

// src/helpers.ts
var registerScript = (scriptObject) => {
  globalThis[config_default.scriptInstanceName] = scriptObject;
  return scriptObject;
};
var generateRandomTokenData = (projectNum = 0, hash = "") => {
  const data = {
    tokenHash: "",
    tokenId: "",
    mintedAt: 0
  };
  if (hash.length === 0 || !hash.startsWith("0x")) {
    hash = "0x";
    for (let i = 0; i < 64; i++) {
      hash += Math.floor(Math.random() * 16).toString(16);
    }
  }
  data.tokenHash = hash;
  data.tokenId = (projectNum * 1e6 + Math.floor(Math.random() * 1e3)).toString();
  return data;
};
function chunkify(str, size) {
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}

// src/lib/sha256.ts
var CHAR_SIZE = 8;
var K = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
];
function pad(str, bits) {
  let res = str;
  while (res.length % bits !== 0) {
    res = "0" + res;
  }
  return res;
}
function rotateRight(bits, turns) {
  return bits.substr(bits.length - turns) + bits.substr(0, bits.length - turns);
}
function preProcess(message) {
  let m = message.split("").map((e) => e.charCodeAt(0)).map((e) => e.toString(2)).map((e) => pad(e, 8)).join("") + "1";
  while (m.length % 512 !== 448) {
    m += "0";
  }
  let ml = (message.length * CHAR_SIZE).toString(2);
  ml = pad(ml, 8);
  ml = "0".repeat(64 - ml.length) + ml;
  return m + ml;
}
function sha256(message) {
  let H0 = 1779033703;
  let H1 = 3144134277;
  let H2 = 1013904242;
  let H3 = 2773480762;
  let H4 = 1359893119;
  let H5 = 2600822924;
  let H6 = 528734635;
  let H7 = 1541459225;
  const bits = preProcess(message);
  const chunks = chunkify(bits, 512);
  chunks.forEach(function(chunk, i) {
    const words = chunkify(chunk, 32);
    for (let i2 = 16; i2 < 64; i2++) {
      const W1 = words[i2 - 15];
      const W2 = words[i2 - 2];
      const R1 = rotateRight(W1, 7);
      const R2 = rotateRight(W1, 18);
      const R3 = rotateRight(W2, 17);
      const R4 = rotateRight(W2, 19);
      const S0 = parseInt(R1, 2) ^ parseInt(R2, 2) ^ parseInt(W1, 2) >>> 3;
      const S1 = parseInt(R3, 2) ^ parseInt(R4, 2) ^ parseInt(W2, 2) >>> 10;
      const val = parseInt(words[i2 - 16], 2) + S0 + parseInt(words[i2 - 7], 2) + S1;
      words[i2] = pad((val >>> 0).toString(2), 32);
    }
    let [a, b, c, d, e, f, g, h] = [H0, H1, H2, H3, H4, H5, H6, H7];
    for (let i2 = 0; i2 < 64; i2++) {
      const S1 = [6, 11, 25].map((turns) => rotateRight(pad(e.toString(2), 32), turns)).map((bitstring) => parseInt(bitstring, 2)).reduce((acc, curr) => acc ^ curr, 0) >>> 0;
      const CH = (e & f ^ ~e & g) >>> 0;
      const temp1 = h + S1 + CH + K[i2] + parseInt(words[i2], 2) >>> 0;
      const S0 = [2, 13, 22].map((turns) => rotateRight(pad(a.toString(2), 32), turns)).map((bitstring) => parseInt(bitstring, 2)).reduce((acc, curr) => acc ^ curr, 0) >>> 0;
      const maj = (a & b ^ a & c ^ b & c) >>> 0;
      const temp2 = S0 + maj >>> 0;
      h = g;
      g = f;
      f = e;
      e = d + temp1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 >>> 0;
    }
    H0 = H0 + a >>> 0;
    H1 = H1 + b >>> 0;
    H2 = H2 + c >>> 0;
    H3 = H3 + d >>> 0;
    H4 = H4 + e >>> 0;
    H5 = H5 + f >>> 0;
    H6 = H6 + g >>> 0;
    H7 = H7 + h >>> 0;
  });
  return [H0, H1, H2, H3, H4, H5, H6, H7].map((e) => e.toString(16)).map((e) => pad(e, 8)).join("");
}
var sha256_default = sha256;

// src/lib/shuffle.ts
function fisherYatesShuffle(randomFunc, originalArray) {
  const result = originalArray.slice(0);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(randomFunc() * (i + 1));
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }
  return result;
}

// src/BaseRandom.ts
var BaseRandom = class {
  constructor(tokenData = { tokenHash: "", tokenId: "" }) {
    this.tokenData = tokenData;
    __publicField(this, "useA", false);
    __publicField(this, "prngA");
    __publicField(this, "prngB");
    const sfc32 = function(uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function() {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        const t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = c << 21 | c >>> 11;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    if (typeof tokenData.tokenHash !== "string") {
      tokenData.tokenHash = `0x${tokenData.tokenHash.toString(16)}`;
    }
    this.prngA = new sfc32(tokenData.tokenHash.substring(2, 32));
    this.prngB = new sfc32(tokenData.tokenHash.substring(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  decimal() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  // random number between a (inclusive) and b (exclusive)
  number(a, b = void 0) {
    if (b === void 0) {
      b = a;
      a = 0;
    }
    return a + (b - a) * this.decimal();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  integer(a, b = void 0) {
    if (b === void 0) {
      b = a;
      a = 0;
    }
    return Math.floor(this.number(a, b + 1));
  }
  // random boolean with p as percent likelihood of true
  boolean(p = 50) {
    return this.decimal() < p * 0.1;
  }
  // random value in an array of items
  element(list) {
    return list[this.integer(0, list.length - 1)];
  }
  // shuffle an array of items using the Fisher-Yates algorithm
  shuffle(list) {
    return fisherYatesShuffle(() => this.decimal(), list);
  }
};

// src/Assets.ts
var getMerakiCdnHost = () => {
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return window.location.origin;
  }
  return `https://mraki.io`;
};
var getMerakiScriptDataAssetsUrl = () => `${getMerakiCdnHost()}/cdn/project-assets/data/`;
var getMerakiScriptFileAssetsUrl = () => `${getMerakiCdnHost()}/cdn/project-assets/files/`;
var ensureSuffix = (path, suffix) => {
  if (path.endsWith(suffix)) {
    return path;
  }
  return path + suffix;
};
var Assets = class {
  sanitizeUrl(url) {
    if (!url.startsWith("/") && !url.startsWith("http")) {
      return url;
    }
    const parsed = new URL(url);
    return parsed.pathname.replaceAll("..", "");
  }
  /**
   * Loads a file from a script asset URL using `p5.loadStrings()`, and returns an array of strings.
   * @param {string} path
   * @returns {string[]}
   */
  async loadStrings(path) {
    path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, "/data.txt"));
    try {
      return loadStrings(path);
    } catch (e) {
    }
    return "";
  }
  /**
   * Loads a file from a script asset URL using `p5.loadXML()`, and returns an XML object.
   * @param {string} path
   * @returns {object}
   */
  async loadXML(path) {
    path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, "/data.xml"));
    try {
      return loadXML(path);
    } catch (e) {
    }
    return "";
  }
  /**
   * Loads a JSON file from a script asset URL using `p5.loadJSON()`, and returns an Object.
   * Note that even if the JSON file contains an Array, an Object will be returned with index numbers as keys.
   * @param {string} path
   * @returns {object}
   */
  async loadJSON(path) {
    path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, "/data.json"));
    try {
      return loadJSON(path);
    } catch (e) {
    }
    return {};
  }
  /**
   * Reads the contents of a script asset URL and creates a `p5.Table` object with its values.
   * @param {string} path
   * @param {string} extension
   * @param {string} header
   * @param {any} callback
   * @param {any} errorCallback
   * @returns {import('p5').Table} p5.Table
   */
  async loadTable(path, extension, header, callback, errorCallback) {
    path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, "/data.csv"));
    try {
      return loadTable(path, extension, header, callback, errorCallback);
    } catch (e) {
    }
    return {};
  }
  /**
   * Loads a file from a script asset URL using `p5.loadBytes()`, and returns an object with a `bytes` property.
   * @param {string} path
   * @returns {object} an object whose 'bytes' property will be the loaded buffer
   */
  async loadBytes(path) {
    path = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(path);
    try {
      return loadBytes(path);
    } catch (e) {
    }
    return { bytes: [] };
  }
  /**
   * Loads an image from the `path` script asset URL and creates a `p5.Image` from it.
   * @param {string} path
   * @param {any} successCallback
   * @param {any} failureCallback
   * @returns {import('p5').Image} p5.Image
   */
  async loadImage(path, successCallback, failureCallback) {
    if (!path.startsWith("data:image/png;base64")) {
      path = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(path);
    }
    try {
      return loadImage(path, successCallback, failureCallback);
    } catch (e) {
    }
    return {};
  }
  /**
   * Loads a font from the `path` script asset URL and creates a `p5.Font` from it.
   * @param {string} path
   * @param {any} callback
   * @param {any} onError
   * @returns {import('p5').Font} p5.Font
   */
  async loadFont(path, callback, onError) {
    path = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(path);
    try {
      return loadFont(path, callback, onError);
    } catch (e) {
    }
    return {};
  }
  /**
   * Creates a new `p5.Shader` object from the provided vertex and fragment shader script asset file urls.
   * @param {string} vertFilename
   * @param {string} fragFilename
   * @param {any} callback
   * @param {any} errorCallback
   * @returns {import('p5').Shader} p5.Shader
   */
  async loadShader(vertFilename, fragFilename, callback, errorCallback) {
    vertFilename = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(vertFilename);
    fragFilename = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(fragFilename);
    try {
      return loadShader(vertFilename, fragFilename, callback, errorCallback);
    } catch (e) {
    }
    return {};
  }
};

// src/Meraki.ts
var win = globalThis || {};
var Meraki = class {
  constructor(tokenId, hash) {
    __publicField(this, "tokenData", {
      tokenHash: "",
      tokenId: "",
      mintedAt: 0
    });
    __publicField(this, "registerScriptCalled", false);
    __publicField(this, "randomObj");
    this.tokenData.tokenId = tokenId;
    this.tokenData.tokenHash = hash;
    this.registerScriptCalled = false;
    this.randomObj = new BaseRandom({ tokenHash: `${hash}`, tokenId: `${tokenId}` });
  }
  get random() {
    return this.randomObj;
  }
  get data() {
    return Object.assign({}, this.tokenData);
  }
  get utils() {
    return {
      hash: {
        murmurhash3,
        sha256
      },
      chunkify
    };
  }
  get assets() {
    return new Assets();
  }
  get canvas() {
    return {
      height: win.innerHeight,
      width: win.innerWidth
    };
  }
  get window() {
    return {
      height: win.innerHeight,
      width: win.innerWidth
    };
  }
  get hasScriptRegistered() {
    return this.registerScriptCalled;
  }
  get project() {
    return win.merakiProject || {};
  }
  log(...args) {
    if (this.isTestMode()) {
      console.log(...args);
    }
  }
  registerScript(scriptObject) {
    if (!this.registerScriptCalled) {
      this.registerScriptCalled = true;
      globalThis[config_default.scriptInstanceName] = scriptObject;
    }
    return scriptObject;
  }
  tokenAgeInSeconds() {
    return ((/* @__PURE__ */ new Date()).getTime() - parseInt(`${this.data.mintedAt}`)) / 1e3;
  }
  isScriptRegistered() {
    return this.registerScriptCalled;
  }
  isTestMode() {
    const location = globalThis.location;
    if (!location) {
      return false;
    }
    if (location.pathname.startsWith("/projects/") && location.search.includes("randomSeed=")) {
      return true;
    }
    if (location.origin === "https://testnets.mraki.io") {
      return true;
    }
    if (location.pathname.startsWith("/token/")) {
      return false;
    }
    return false;
  }
};

// src/MerakiScript.ts
var MerakiScript3 = class {
  draw() {
  }
  initialize() {
  }
  finalize() {
  }
  render() {
    this.initialize();
    this.execute();
    this.finalize();
  }
};

// src/sdk.ts
var sdk = {
  Meraki,
  MerakiScript: MerakiScript3,
  generateRandomTokenData,
  // @ts-ignore
  version: "1.4.5"
};
var sdk_default = sdk;
/*!
 * +----------------------------------------------------------------------------------+
 * | murmurHash3.js v3.0.0 (http://github.com/karanlyons/murmurHash3.js)              |
 * | A TypeScript/JavaScript implementation of MurmurHash3's hashing algorithms.      |
 * |----------------------------------------------------------------------------------|
 * | Copyright (c) 2012-2020 Karan Lyons. Freely distributable under the MIT license. |
 * +----------------------------------------------------------------------------------+
 */
