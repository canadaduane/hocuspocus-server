import AsyncLock from 'async-lock';
import { writeAuthenticated, writePermissionDenied, WsReadyStates, ConnectionTimeout, Forbidden, Unauthorized, ResetConnection, awarenessStatesToArray } from '@hocuspocus/common';
import * as Y from 'yjs';
import { Doc, applyUpdate, encodeStateAsUpdate } from 'yjs';
import { createServer } from 'http';
import kleur from 'kleur';
import { v4 } from 'uuid';
import { WebSocketServer } from 'ws';
import { URLSearchParams } from 'url';

/**
 * Utility module to work with sets.
 *
 * @module set
 */

const create$2 = () => new Set();

/**
 * Utility module to work with Arrays.
 *
 * @module array
 */

/**
 * Transforms something array-like to an actual Array.
 *
 * @function
 * @template T
 * @param {ArrayLike<T>|Iterable<T>} arraylike
 * @return {T}
 */
const from = Array.from;

/**
 * @param {string} s
 * @return {string}
 */
const toLowerCase = s => s.toLowerCase();

const trimLeftRegex = /^\s*/g;

/**
 * @param {string} s
 * @return {string}
 */
const trimLeft = s => s.replace(trimLeftRegex, '');

const fromCamelCaseRegex = /([A-Z])/g;

/**
 * @param {string} s
 * @param {string} separator
 * @return {string}
 */
const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, match => `${separator}${toLowerCase(match)}`));

/**
 * @param {string} str
 * @return {Uint8Array}
 */
const _encodeUtf8Polyfill = str => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = /** @type {number} */ (encodedString.codePointAt(i));
  }
  return buf
};

/* c8 ignore next */
const utf8TextEncoder = /** @type {TextEncoder} */ (typeof TextEncoder !== 'undefined' ? new TextEncoder() : null);

/**
 * @param {string} str
 * @return {Uint8Array}
 */
const _encodeUtf8Native = str => utf8TextEncoder.encode(str);

/**
 * @param {string} str
 * @return {Uint8Array}
 */
/* c8 ignore next */
const encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;

/* c8 ignore next */
let utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

/* c8 ignore start */
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  // Safari doesn't handle BOM correctly.
  // This fixes a bug in Safari 13.0.5 where it produces a BOM the first time it is called.
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the first call and
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the second call
  // Another issue is that from then on no BOM chars are recognized anymore
  /* c8 ignore next */
  utf8TextDecoder = null;
}

/**
 * Utility module to work with key-value stores.
 *
 * @module map
 */

/**
 * Creates a new Map instance.
 *
 * @function
 * @return {Map<any, any>}
 *
 * @function
 */
const create$1 = () => new Map();

/**
 * Get map property. Create T if property is undefined and set T on map.
 *
 * ```js
 * const listeners = map.setIfUndefined(events, 'eventName', set.create)
 * listeners.add(listener)
 * ```
 *
 * @function
 * @template V,K
 * @template {Map<K,V>} MAP
 * @param {MAP} map
 * @param {K} key
 * @param {function():V} createT
 * @return {V}
 */
const setIfUndefined = (map, key, createT) => {
  let set = map.get(key);
  if (set === undefined) {
    map.set(key, set = createT());
  }
  return set
};

/**
 * Often used conditions.
 *
 * @module conditions
 */

/**
 * @template T
 * @param {T|null|undefined} v
 * @return {T|null}
 */
/* c8 ignore next */
const undefinedToNull = v => v === undefined ? null : v;

/* eslint-env browser */

/**
 * Isomorphic variable storage.
 *
 * Uses LocalStorage in the browser and falls back to in-memory storage.
 *
 * @module storage
 */

/* c8 ignore start */
class VarStoragePolyfill {
  constructor () {
    this.map = new Map();
  }

  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem (key, newValue) {
    this.map.set(key, newValue);
  }

  /**
   * @param {string} key
   */
  getItem (key) {
    return this.map.get(key)
  }
}
/* c8 ignore stop */

/**
 * @type {any}
 */
let _localStorage = new VarStoragePolyfill();
let usePolyfill = true;

/* c8 ignore start */
try {
  // if the same-origin rule is violated, accessing localStorage might thrown an error
  if (typeof localStorage !== 'undefined') {
    _localStorage = localStorage;
    usePolyfill = false;
  }
} catch (e) { }
/* c8 ignore stop */

/**
 * This is basically localStorage in browser, or a polyfill in nodejs
 */
/* c8 ignore next */
const varStorage = _localStorage;

/**
 * Utility functions for working with EcmaScript objects.
 *
 * @module object
 */

/**
 * @param {Object<string,any>} obj
 */
const keys = Object.keys;

/**
 * @param {Object<string,any>} obj
 * @return {number}
 */
const length$1 = obj => keys(obj).length;

/**
 * Calls `Object.prototype.hasOwnProperty`.
 *
 * @param {any} obj
 * @param {string|symbol} key
 * @return {boolean}
 */
const hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Common functions and function call helpers.
 *
 * @module function
 */

/**
 * @template T
 *
 * @param {T} a
 * @param {T} b
 * @return {boolean}
 */
const equalityStrict = (a, b) => a === b;

/* c8 ignore start */

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
const equalityDeep = (a, b) => {
  if (a == null || b == null) {
    return equalityStrict(a, b)
  }
  if (a.constructor !== b.constructor) {
    return false
  }
  if (a === b) {
    return true
  }
  switch (a.constructor) {
    case ArrayBuffer:
      a = new Uint8Array(a);
      b = new Uint8Array(b);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (a.byteLength !== b.byteLength) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false
        }
      }
      break
    }
    case Set: {
      if (a.size !== b.size) {
        return false
      }
      for (const value of a) {
        if (!b.has(value)) {
          return false
        }
      }
      break
    }
    case Map: {
      if (a.size !== b.size) {
        return false
      }
      for (const key of a.keys()) {
        if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
          return false
        }
      }
      break
    }
    case Object:
      if (length$1(a) !== length$1(b)) {
        return false
      }
      for (const key in a) {
        if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
          return false
        }
      }
      break
    case Array:
      if (a.length !== b.length) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (!equalityDeep(a[i], b[i])) {
          return false
        }
      }
      break
    default:
      return false
  }
  return true
};

/**
 * @template V
 * @template {V} OPTS
 *
 * @param {V} value
 * @param {Array<OPTS>} options
 */
// @ts-ignore
const isOneOf = (value, options) => options.includes(value);

/**
 * Isomorphic module to work access the environment (query params, env variables).
 *
 * @module map
 */

/* c8 ignore next */
// @ts-ignore
const isNode = typeof process !== 'undefined' && process.release &&
  /node|io\.js/.test(process.release.name);
/* c8 ignore next 3 */
typeof navigator !== 'undefined'
  ? /Mac/.test(navigator.platform)
  : false;

/**
 * @type {Map<string,string>}
 */
let params;

/* c8 ignore start */
const computeParams = () => {
  if (params === undefined) {
    if (isNode) {
      params = create$1();
      const pargs = process.argv;
      let currParamName = null;
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === '-') {
          if (currParamName !== null) {
            params.set(currParamName, '');
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg);
            currParamName = null;
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, '');
      }
      // in ReactNative for example this would not be true (unless connected to the Remote Debugger)
    } else if (typeof location === 'object') {
      params = create$1(); // eslint-disable-next-line no-undef
      (location.search || '?').slice(1).split('&').forEach((kv) => {
        if (kv.length !== 0) {
          const [key, value] = kv.split('=');
          params.set(`--${fromCamelCase(key, '-')}`, value);
          params.set(`-${fromCamelCase(key, '-')}`, value);
        }
      });
    } else {
      params = create$1();
    }
  }
  return params
};
/* c8 ignore stop */

/**
 * @param {string} name
 * @return {boolean}
 */
/* c8 ignore next */
const hasParam = (name) => computeParams().has(name);

/**
 * @param {string} name
 * @return {string|null}
 */
/* c8 ignore next 4 */
const getVariable = (name) =>
  isNode
    ? undefinedToNull(process.env[name.toUpperCase()])
    : undefinedToNull(varStorage.getItem(name));

/**
 * @param {string} name
 * @return {boolean}
 */
/* c8 ignore next 2 */
const hasConf = (name) =>
  hasParam('--' + name) || getVariable(name) !== null;

/* c8 ignore next */
hasConf('production');

/* c8 ignore next 2 */
const forceColor = isNode &&
  isOneOf(process.env.FORCE_COLOR, ['true', '1', '2']);

/* c8 ignore start */
!hasParam('no-colors') &&
  (!isNode || process.stdout.isTTY || forceColor) && (
  !isNode || hasParam('color') || forceColor ||
    getVariable('COLORTERM') !== null ||
    (getVariable('TERM') || '').includes('color')
);
/* c8 ignore stop */

/**
 * Common Math expressions.
 *
 * @module math
 */

const floor = Math.floor;

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The smaller element of a and b
 */
const min = (a, b) => a < b ? a : b;

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The bigger element of a and b
 */
const max = (a, b) => a > b ? a : b;

/* eslint-env browser */
const BIT8 = 128;
const BITS7 = 127;

/**
 * Utility helpers for working with numbers.
 *
 * @module number
 */

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

/**
 * Efficient schema-less binary encoding with support for variable length encoding.
 *
 * Use [lib0/encoding] with [lib0/decoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module encoding
 */

/**
 * A BinaryEncoder handles the encoding to an Uint8Array.
 */
class Encoder {
  constructor () {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    /**
     * @type {Array<Uint8Array>}
     */
    this.bufs = [];
  }
}

/**
 * @function
 * @return {Encoder}
 */
const createEncoder = () => new Encoder();

/**
 * The current length of the encoded data.
 *
 * @function
 * @param {Encoder} encoder
 * @return {number}
 */
const length = encoder => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len
};

/**
 * Transform to Uint8Array.
 *
 * @function
 * @param {Encoder} encoder
 * @return {Uint8Array} The created ArrayBuffer.
 */
const toUint8Array = encoder => {
  const uint8arr = new Uint8Array(length(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr
};

/**
 * Write one byte to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The byte that is to be encoded.
 */
const write = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};

/**
 * Write a variable length unsigned integer. Max encodable integer is 2^53.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeVarUint = (encoder, num) => {
  while (num > BITS7) {
    write(encoder, BIT8 | (BITS7 & num));
    num = floor(num / 128); // shift >>> 7
  }
  write(encoder, BITS7 & num);
};

/**
 * A cache to store strings temporarily
 */
const _strBuffer = new Uint8Array(30000);
const _maxStrBSize = _strBuffer.length / 3;

/**
 * Write a variable length string.
 *
 * @function
 * @param {Encoder} encoder
 * @param {String} str The string that is to be encoded.
 */
const _writeVarStringNative = (encoder, str) => {
  if (str.length < _maxStrBSize) {
    // We can encode the string into the existing buffer
    /* c8 ignore next */
    const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
    writeVarUint(encoder, written);
    for (let i = 0; i < written; i++) {
      write(encoder, _strBuffer[i]);
    }
  } else {
    writeVarUint8Array(encoder, encodeUtf8(str));
  }
};

/**
 * Write a variable length string.
 *
 * @function
 * @param {Encoder} encoder
 * @param {String} str The string that is to be encoded.
 */
const _writeVarStringPolyfill = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    write(encoder, /** @type {number} */ (encodedString.codePointAt(i)));
  }
};

/**
 * Write a variable length string.
 *
 * @function
 * @param {Encoder} encoder
 * @param {String} str The string that is to be encoded.
 */
/* c8 ignore next */
const writeVarString = (utf8TextEncoder && /** @type {any} */ (utf8TextEncoder).encodeInto) ? _writeVarStringNative : _writeVarStringPolyfill;

/**
 * Append fixed-length Uint8Array to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeUint8Array = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    // Still something to write, write right half..
    // Append new buffer
    encoder.bufs.push(encoder.cbuf);
    // must have at least size of remaining buffer
    encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
    // copy array
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};

/**
 * Append an Uint8Array to Encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeVarUint8Array = (encoder, uint8Array) => {
  writeVarUint(encoder, uint8Array.byteLength);
  writeUint8Array(encoder, uint8Array);
};

/**
 * Utility functions to work with buffers (Uint8Array).
 *
 * @module buffer
 */

/**
 * Create Uint8Array with initial content from buffer
 *
 * @param {ArrayBuffer} buffer
 * @param {number} byteOffset
 * @param {number} length
 */
const createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length) => new Uint8Array(buffer, byteOffset, length);

/**
 * Error helpers.
 *
 * @module error
 */

/**
 * @param {string} s
 * @return {Error}
 */
/* c8 ignore next */
const create = s => new Error(s);

/**
 * Efficient schema-less binary decoding with support for variable length encoding.
 *
 * Use [lib0/decoding] with [lib0/encoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module decoding
 */

const errorUnexpectedEndOfArray = create('Unexpected end of array');
const errorIntegerOutOfRange = create('Integer out of Range');

/**
 * A Decoder handles the decoding of an Uint8Array.
 */
class Decoder {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor (uint8Array) {
    /**
     * Decoding target.
     *
     * @type {Uint8Array}
     */
    this.arr = uint8Array;
    /**
     * Current decoding position.
     *
     * @type {number}
     */
    this.pos = 0;
  }
}

/**
 * @function
 * @param {Uint8Array} uint8Array
 * @return {Decoder}
 */
const createDecoder = uint8Array => new Decoder(uint8Array);

/**
 * Create an Uint8Array view of the next `len` bytes and advance the position by `len`.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder The decoder instance
 * @param {number} len The length of bytes to read
 * @return {Uint8Array}
 */
const readUint8Array = (decoder, len) => {
  const view = createUint8ArrayViewFromArrayBuffer(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
  decoder.pos += len;
  return view
};

/**
 * Read variable length Uint8Array.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder
 * @return {Uint8Array}
 */
const readVarUint8Array = decoder => readUint8Array(decoder, readVarUint(decoder));

/**
 * Read one byte as unsigned integer.
 * @function
 * @param {Decoder} decoder The decoder instance
 * @return {number} Unsigned 8-bit integer
 */
const readUint8 = decoder => decoder.arr[decoder.pos++];

/**
 * Read unsigned integer (32bit) with variable length.
 * 1/8th of the storage is used as encoding overhead.
 *  * numbers < 2^7 is stored in one bytlength
 *  * numbers < 2^14 is stored in two bylength
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.length
 */
const readVarUint = decoder => {
  let num = 0;
  let mult = 1;
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    const r = decoder.arr[decoder.pos++];
    // num = num | ((r & binary.BITS7) << len)
    num = num + (r & BITS7) * mult; // shift $r << (7*#iterations) and add it to num
    mult *= 128; // next iteration, shift 7 "more" to the left
    if (r < BIT8) {
      return num
    }
    /* c8 ignore start */
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange
    }
    /* c8 ignore stop */
  }
  throw errorUnexpectedEndOfArray
};

/**
 * We don't test this function anymore as we use native decoding/encoding by default now.
 * Better not modify this anymore..
 *
 * Transforming utf8 to a string is pretty expensive. The code performs 10x better
 * when String.fromCodePoint is fed with all characters as arguments.
 * But most environments have a maximum number of arguments per functions.
 * For effiency reasons we apply a maximum of 10000 characters at once.
 *
 * @function
 * @param {Decoder} decoder
 * @return {String} The read String.
 */
/* c8 ignore start */
const _readVarStringPolyfill = decoder => {
  let remainingLen = readVarUint(decoder);
  if (remainingLen === 0) {
    return ''
  } else {
    let encodedString = String.fromCodePoint(readUint8(decoder)); // remember to decrease remainingLen
    if (--remainingLen < 100) { // do not create a Uint8Array for small strings
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8(decoder));
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 10000 ? remainingLen : 10000;
        // this is dangerous, we create a fresh array view from the existing buffer
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
        decoder.pos += nextLen;
        // Starting with ES5.1 we can supply a generic array-like object as arguments
        encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes));
        remainingLen -= nextLen;
      }
    }
    return decodeURIComponent(escape(encodedString))
  }
};
/* c8 ignore stop */

/**
 * @function
 * @param {Decoder} decoder
 * @return {String} The read String
 */
const _readVarStringNative = decoder =>
  /** @type any */ (utf8TextDecoder).decode(readVarUint8Array(decoder));

/**
 * Read string of variable length
 * * varUint is used to store the length of the string
 *
 * @function
 * @param {Decoder} decoder
 * @return {String} The read String
 *
 */
/* c8 ignore next */
const readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;

class IncomingMessage {
    constructor(input) {
        if (!(input instanceof Uint8Array)) {
            input = new Uint8Array(input);
        }
        this.decoder = createDecoder(input);
    }
    get encoder() {
        if (!this.encoderInternal) {
            this.encoderInternal = createEncoder();
        }
        return this.encoderInternal;
    }
    readVarUint8Array() {
        return readVarUint8Array(this.decoder);
    }
    readVarUint() {
        return readVarUint(this.decoder);
    }
    readVarString() {
        return readVarString(this.decoder);
    }
    toUint8Array() {
        return toUint8Array(this.encoder);
    }
    writeVarUint(type) {
        writeVarUint(this.encoder, type);
    }
    writeVarString(string) {
        writeVarString(this.encoder, string);
    }
    get length() {
        return length(this.encoder);
    }
}

/**
 * Utility module to work with time.
 *
 * @module time
 */

/**
 * Return current unix time.
 *
 * @return {number}
 */
const getUnixTime = Date.now;

/**
 * Observable class prototype.
 *
 * @module observable
 */

/**
 * Handles named events.
 *
 * @template N
 */
class Observable {
  constructor () {
    /**
     * Some desc.
     * @type {Map<N, any>}
     */
    this._observers = create$1();
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  on (name, f) {
    setIfUndefined(this._observers, name, create$2).add(f);
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  once (name, f) {
    /**
     * @param  {...any} args
     */
    const _f = (...args) => {
      this.off(name, _f);
      f(...args);
    };
    this.on(name, _f);
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  off (name, f) {
    const observers = this._observers.get(name);
    if (observers !== undefined) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }

  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit (name, args) {
    // copy all listeners to an array first to make sure that no event is emitted to listeners that are subscribed while the event handler is called.
    return from((this._observers.get(name) || create$1()).values()).forEach(f => f(...args))
  }

  destroy () {
    this._observers = create$1();
  }
}

/**
 * @module awareness-protocol
 */

const outdatedTimeout = 30000;

/**
 * @typedef {Object} MetaClientState
 * @property {number} MetaClientState.clock
 * @property {number} MetaClientState.lastUpdated unix timestamp
 */

/**
 * The Awareness class implements a simple shared state protocol that can be used for non-persistent data like awareness information
 * (cursor, username, status, ..). Each client can update its own local state and listen to state changes of
 * remote clients. Every client may set a state of a remote peer to `null` to mark the client as offline.
 *
 * Each client is identified by a unique client id (something we borrow from `doc.clientID`). A client can override
 * its own state by propagating a message with an increasing timestamp (`clock`). If such a message is received, it is
 * applied if the known state of that client is older than the new state (`clock < newClock`). If a client thinks that
 * a remote client is offline, it may propagate a message with
 * `{ clock: currentClientClock, state: null, client: remoteClient }`. If such a
 * message is received, and the known clock of that client equals the received clock, it will override the state with `null`.
 *
 * Before a client disconnects, it should propagate a `null` state with an updated clock.
 *
 * Awareness states must be updated every 30 seconds. Otherwise the Awareness instance will delete the client state.
 *
 * @extends {Observable<string>}
 */
class Awareness extends Observable {
  /**
   * @param {Y.Doc} doc
   */
  constructor (doc) {
    super();
    this.doc = doc;
    /**
     * @type {number}
     */
    this.clientID = doc.clientID;
    /**
     * Maps from client id to client state
     * @type {Map<number, Object<string, any>>}
     */
    this.states = new Map();
    /**
     * @type {Map<number, MetaClientState>}
     */
    this.meta = new Map();
    this._checkInterval = /** @type {any} */ (setInterval(() => {
      const now = getUnixTime();
      if (this.getLocalState() !== null && (outdatedTimeout / 2 <= now - /** @type {{lastUpdated:number}} */ (this.meta.get(this.clientID)).lastUpdated)) {
        // renew local clock
        this.setLocalState(this.getLocalState());
      }
      /**
       * @type {Array<number>}
       */
      const remove = [];
      this.meta.forEach((meta, clientid) => {
        if (clientid !== this.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) {
          remove.push(clientid);
        }
      });
      if (remove.length > 0) {
        removeAwarenessStates(this, remove, 'timeout');
      }
    }, floor(outdatedTimeout / 10)));
    doc.on('destroy', () => {
      this.destroy();
    });
    this.setLocalState({});
  }

  destroy () {
    this.emit('destroy', [this]);
    this.setLocalState(null);
    super.destroy();
    clearInterval(this._checkInterval);
  }

  /**
   * @return {Object<string,any>|null}
   */
  getLocalState () {
    return this.states.get(this.clientID) || null
  }

  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState (state) {
    const clientID = this.clientID;
    const currLocalMeta = this.meta.get(clientID);
    const clock = currLocalMeta === undefined ? 0 : currLocalMeta.clock + 1;
    const prevState = this.states.get(clientID);
    if (state === null) {
      this.states.delete(clientID);
    } else {
      this.states.set(clientID, state);
    }
    this.meta.set(clientID, {
      clock,
      lastUpdated: getUnixTime()
    });
    const added = [];
    const updated = [];
    const filteredUpdated = [];
    const removed = [];
    if (state === null) {
      removed.push(clientID);
    } else if (prevState == null) {
      if (state != null) {
        added.push(clientID);
      }
    } else {
      updated.push(clientID);
      if (!equalityDeep(prevState, state)) {
        filteredUpdated.push(clientID);
      }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
      this.emit('change', [{ added, updated: filteredUpdated, removed }, 'local']);
    }
    this.emit('update', [{ added, updated, removed }, 'local']);
  }

  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField (field, value) {
    const state = this.getLocalState();
    if (state !== null) {
      this.setLocalState({
        ...state,
        [field]: value
      });
    }
  }

  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates () {
    return this.states
  }
}

/**
 * Mark (remote) clients as inactive and remove them from the list of active peers.
 * This change will be propagated to remote clients.
 *
 * @param {Awareness} awareness
 * @param {Array<number>} clients
 * @param {any} origin
 */
const removeAwarenessStates = (awareness, clients, origin) => {
  const removed = [];
  for (let i = 0; i < clients.length; i++) {
    const clientID = clients[i];
    if (awareness.states.has(clientID)) {
      awareness.states.delete(clientID);
      if (clientID === awareness.clientID) {
        const curMeta = /** @type {MetaClientState} */ (awareness.meta.get(clientID));
        awareness.meta.set(clientID, {
          clock: curMeta.clock + 1,
          lastUpdated: getUnixTime()
        });
      }
      removed.push(clientID);
    }
  }
  if (removed.length > 0) {
    awareness.emit('change', [{ added: [], updated: [], removed }, origin]);
    awareness.emit('update', [{ added: [], updated: [], removed }, origin]);
  }
};

/**
 * @param {Awareness} awareness
 * @param {Array<number>} clients
 * @return {Uint8Array}
 */
const encodeAwarenessUpdate = (awareness, clients, states = awareness.states) => {
  const len = clients.length;
  const encoder = createEncoder();
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    const clientID = clients[i];
    const state = states.get(clientID) || null;
    const clock = /** @type {MetaClientState} */ (awareness.meta.get(clientID)).clock;
    writeVarUint(encoder, clientID);
    writeVarUint(encoder, clock);
    writeVarString(encoder, JSON.stringify(state));
  }
  return toUint8Array(encoder)
};

/**
 * @param {Awareness} awareness
 * @param {Uint8Array} update
 * @param {any} origin This will be added to the emitted change event
 */
const applyAwarenessUpdate = (awareness, update, origin) => {
  const decoder = createDecoder(update);
  const timestamp = getUnixTime();
  const added = [];
  const updated = [];
  const filteredUpdated = [];
  const removed = [];
  const len = readVarUint(decoder);
  for (let i = 0; i < len; i++) {
    const clientID = readVarUint(decoder);
    let clock = readVarUint(decoder);
    const state = JSON.parse(readVarString(decoder));
    const clientMeta = awareness.meta.get(clientID);
    const prevState = awareness.states.get(clientID);
    const currClock = clientMeta === undefined ? 0 : clientMeta.clock;
    if (currClock < clock || (currClock === clock && state === null && awareness.states.has(clientID))) {
      if (state === null) {
        // never let a remote client remove this local state
        if (clientID === awareness.clientID && awareness.getLocalState() != null) {
          // remote client removed the local state. Do not remote state. Broadcast a message indicating
          // that this client still exists by increasing the clock
          clock++;
        } else {
          awareness.states.delete(clientID);
        }
      } else {
        awareness.states.set(clientID, state);
      }
      awareness.meta.set(clientID, {
        clock,
        lastUpdated: timestamp
      });
      if (clientMeta === undefined && state !== null) {
        added.push(clientID);
      } else if (clientMeta !== undefined && state === null) {
        removed.push(clientID);
      } else if (state !== null) {
        if (!equalityDeep(state, prevState)) {
          filteredUpdated.push(clientID);
        }
        updated.push(clientID);
      }
    }
  }
  if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
    awareness.emit('change', [{
      added, updated: filteredUpdated, removed
    }, origin]);
  }
  if (added.length > 0 || updated.length > 0 || removed.length > 0) {
    awareness.emit('update', [{
      added, updated, removed
    }, origin]);
  }
};

/**
 * @module sync-protocol
 */

/**
 * @typedef {Map<number, number>} StateMap
 */

/**
 * Core Yjs defines two message types:
 * • YjsSyncStep1: Includes the State Set of the sending client. When received, the client should reply with YjsSyncStep2.
 * • YjsSyncStep2: Includes all missing structs and the complete delete set. When received, the client is assured that it
 *   received all information from the remote client.
 *
 * In a peer-to-peer network, you may want to introduce a SyncDone message type. Both parties should initiate the connection
 * with SyncStep1. When a client received SyncStep2, it should reply with SyncDone. When the local client received both
 * SyncStep2 and SyncDone, it is assured that it is synced to the remote client.
 *
 * In a client-server model, you want to handle this differently: The client should initiate the connection with SyncStep1.
 * When the server receives SyncStep1, it should reply with SyncStep2 immediately followed by SyncStep1. The client replies
 * with SyncStep2 when it receives SyncStep1. Optionally the server may send a SyncDone after it received SyncStep2, so the
 * client knows that the sync is finished.  There are two reasons for this more elaborated sync model: 1. This protocol can
 * easily be implemented on top of http and websockets. 2. The server shoul only reply to requests, and not initiate them.
 * Therefore it is necesarry that the client initiates the sync.
 *
 * Construction of a message:
 * [messageType : varUint, message definition..]
 *
 * Note: A message does not include information about the room name. This must to be handled by the upper layer protocol!
 *
 * stringify[messageType] stringifies a message definition (messageType is already read from the bufffer)
 */

const messageYjsSyncStep1 = 0;
const messageYjsSyncStep2 = 1;
const messageYjsUpdate = 2;

/**
 * Create a sync step 1 message based on the state of the current shared document.
 *
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 */
const writeSyncStep1 = (encoder, doc) => {
  writeVarUint(encoder, messageYjsSyncStep1);
  const sv = Y.encodeStateVector(doc);
  writeVarUint8Array(encoder, sv);
};

/**
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 * @param {Uint8Array} [encodedStateVector]
 */
const writeSyncStep2 = (encoder, doc, encodedStateVector) => {
  writeVarUint(encoder, messageYjsSyncStep2);
  writeVarUint8Array(encoder, Y.encodeStateAsUpdate(doc, encodedStateVector));
};

/**
 * Read SyncStep1 message and reply with SyncStep2.
 *
 * @param {decoding.Decoder} decoder The reply to the received message
 * @param {encoding.Encoder} encoder The received message
 * @param {Y.Doc} doc
 */
const readSyncStep1 = (decoder, encoder, doc) =>
  writeSyncStep2(encoder, doc, readVarUint8Array(decoder));

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readSyncStep2 = (decoder, doc, transactionOrigin) => {
  try {
    Y.applyUpdate(doc, readVarUint8Array(decoder), transactionOrigin);
  } catch (error) {
    // This catches errors that are thrown by event handlers
    console.error('Caught error while handling a Yjs update', error);
  }
};

/**
 * @param {encoding.Encoder} encoder
 * @param {Uint8Array} update
 */
const writeUpdate = (encoder, update) => {
  writeVarUint(encoder, messageYjsUpdate);
  writeVarUint8Array(encoder, update);
};

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readUpdate = readSyncStep2;

var MessageType;
(function (MessageType) {
    MessageType[MessageType["Unknown"] = -1] = "Unknown";
    MessageType[MessageType["Sync"] = 0] = "Sync";
    MessageType[MessageType["Awareness"] = 1] = "Awareness";
    MessageType[MessageType["Auth"] = 2] = "Auth";
    MessageType[MessageType["QueryAwareness"] = 3] = "QueryAwareness";
    MessageType[MessageType["SyncReply"] = 4] = "SyncReply";
    MessageType[MessageType["Stateless"] = 5] = "Stateless";
    MessageType[MessageType["BroadcastStateless"] = 6] = "BroadcastStateless";
    MessageType[MessageType["CLOSE"] = 7] = "CLOSE";
    MessageType[MessageType["SyncStatus"] = 8] = "SyncStatus";
})(MessageType || (MessageType = {}));

class OutgoingMessage {
    constructor(documentName) {
        this.encoder = createEncoder();
        writeVarString(this.encoder, documentName);
    }
    createSyncMessage() {
        this.type = MessageType.Sync;
        writeVarUint(this.encoder, MessageType.Sync);
        return this;
    }
    createSyncReplyMessage() {
        this.type = MessageType.SyncReply;
        writeVarUint(this.encoder, MessageType.SyncReply);
        return this;
    }
    createAwarenessUpdateMessage(awareness, changedClients) {
        this.type = MessageType.Awareness;
        this.category = 'Update';
        const message = encodeAwarenessUpdate(awareness, changedClients || Array.from(awareness.getStates().keys()));
        writeVarUint(this.encoder, MessageType.Awareness);
        writeVarUint8Array(this.encoder, message);
        return this;
    }
    writeQueryAwareness() {
        this.type = MessageType.QueryAwareness;
        this.category = 'Update';
        writeVarUint(this.encoder, MessageType.QueryAwareness);
        return this;
    }
    writeAuthenticated(readonly) {
        this.type = MessageType.Auth;
        this.category = 'Authenticated';
        writeVarUint(this.encoder, MessageType.Auth);
        writeAuthenticated(this.encoder, readonly ? 'readonly' : 'read-write');
        return this;
    }
    writePermissionDenied(reason) {
        this.type = MessageType.Auth;
        this.category = 'PermissionDenied';
        writeVarUint(this.encoder, MessageType.Auth);
        writePermissionDenied(this.encoder, reason);
        return this;
    }
    writeFirstSyncStepFor(document) {
        this.category = 'SyncStep1';
        writeSyncStep1(this.encoder, document);
        return this;
    }
    writeUpdate(update) {
        this.category = 'Update';
        writeUpdate(this.encoder, update);
        return this;
    }
    writeStateless(payload) {
        this.category = 'Stateless';
        writeVarUint(this.encoder, MessageType.Stateless);
        writeVarString(this.encoder, payload);
        return this;
    }
    writeBroadcastStateless(payload) {
        this.category = 'Stateless';
        writeVarUint(this.encoder, MessageType.BroadcastStateless);
        writeVarString(this.encoder, payload);
        return this;
    }
    // TODO: should this be write* or create* as method name?
    writeSyncStatus(updateSaved) {
        this.category = 'SyncStatus';
        writeVarUint(this.encoder, MessageType.SyncStatus);
        writeVarUint(this.encoder, updateSaved ? 1 : 0);
        return this;
    }
    toUint8Array() {
        return toUint8Array(this.encoder);
    }
}

class MessageReceiver {
    constructor(message, logger) {
        this.message = message;
        this.logger = logger;
    }
    apply(document, connection, reply) {
        const { message } = this;
        const type = message.readVarUint();
        const emptyMessageLength = message.length;
        switch (type) {
            case MessageType.Sync:
            case MessageType.SyncReply: {
                message.writeVarUint(MessageType.Sync);
                this.readSyncMessage(message, document, connection, reply, type !== MessageType.SyncReply);
                if (message.length > emptyMessageLength + 1) {
                    if (reply) {
                        reply(message.toUint8Array());
                    }
                    else if (connection) {
                        // TODO: We should log this, shouldn’t we?
                        // this.logger.log({
                        //   direction: 'out',
                        //   type: MessageType.Awareness,
                        //   category: 'Update',
                        // })
                        connection.send(message.toUint8Array());
                    }
                }
                break;
            }
            case MessageType.Awareness: {
                this.logger.log({
                    direction: 'in',
                    type: MessageType.Awareness,
                    category: 'Update',
                });
                applyAwarenessUpdate(document.awareness, message.readVarUint8Array(), connection);
                break;
            }
            case MessageType.QueryAwareness: {
                this.applyQueryAwarenessMessage(document, reply);
                break;
            }
            case MessageType.Stateless: {
                connection === null || connection === void 0 ? void 0 : connection.callbacks.statelessCallback({
                    connection,
                    documentName: document.name,
                    document,
                    payload: readVarString(message.decoder),
                });
                break;
            }
            case MessageType.BroadcastStateless: {
                const msg = message.readVarString();
                document.getConnections().forEach(connection => {
                    connection.sendStateless(msg);
                });
                break;
            }
            case MessageType.CLOSE: {
                connection === null || connection === void 0 ? void 0 : connection.close({
                    code: 1000,
                    reason: 'provider_initiated',
                });
                break;
            }
            default:
                console.error(`Unable to handle message of type ${type}: no handler defined!`);
            // Do nothing
        }
    }
    readSyncMessage(message, document, connection, reply, requestFirstSync = true) {
        const type = message.readVarUint();
        switch (type) {
            case messageYjsSyncStep1: {
                this.logger.log({
                    direction: 'in',
                    type: MessageType.Sync,
                    category: 'SyncStep1',
                });
                readSyncStep1(message.decoder, message.encoder, document);
                // When the server receives SyncStep1, it should reply with SyncStep2 immediately followed by SyncStep1.
                this.logger.log({
                    direction: 'out',
                    type: MessageType.Sync,
                    category: 'SyncStep2',
                });
                if (reply && requestFirstSync) {
                    const syncMessage = (new OutgoingMessage(document.name)
                        .createSyncReplyMessage()
                        .writeFirstSyncStepFor(document));
                    this.logger.log({
                        direction: 'out',
                        type: MessageType.Sync,
                        category: 'SyncStep1',
                    });
                    reply(syncMessage.toUint8Array());
                }
                else if (connection) {
                    const syncMessage = (new OutgoingMessage(document.name)
                        .createSyncMessage()
                        .writeFirstSyncStepFor(document));
                    this.logger.log({
                        direction: 'out',
                        type: MessageType.Sync,
                        category: 'SyncStep1',
                    });
                    connection.send(syncMessage.toUint8Array());
                }
                break;
            }
            case messageYjsSyncStep2:
                this.logger.log({
                    direction: 'in',
                    type: MessageType.Sync,
                    category: 'SyncStep2',
                });
                if (connection === null || connection === void 0 ? void 0 : connection.readOnly) {
                    // We're in read-only mode, so we can't apply the update.
                    // Let's use snapshotContainsUpdate to see if the update actually contains changes.
                    // If not, we can still ack the update
                    const snapshot = Y.snapshot(document);
                    const update = readVarUint8Array(message.decoder);
                    if (Y.snapshotContainsUpdate(snapshot, update)) {
                        // no new changes in update
                        const ackMessage = new OutgoingMessage(document.name)
                            .writeSyncStatus(true);
                        connection.send(ackMessage.toUint8Array());
                    }
                    else {
                        // new changes in update that we can't apply, because readOnly
                        const ackMessage = new OutgoingMessage(document.name)
                            .writeSyncStatus(false);
                        connection.send(ackMessage.toUint8Array());
                    }
                    break;
                }
                readSyncStep2(message.decoder, document, connection);
                if (connection) {
                    connection.send(new OutgoingMessage(document.name)
                        .writeSyncStatus(true).toUint8Array());
                }
                break;
            case messageYjsUpdate:
                this.logger.log({
                    direction: 'in',
                    type: MessageType.Sync,
                    category: 'Update',
                });
                if (connection === null || connection === void 0 ? void 0 : connection.readOnly) {
                    connection.send(new OutgoingMessage(document.name)
                        .writeSyncStatus(false).toUint8Array());
                    break;
                }
                readUpdate(message.decoder, document, connection);
                if (connection) {
                    connection.send(new OutgoingMessage(document.name)
                        .writeSyncStatus(true).toUint8Array());
                }
                break;
            default:
                throw new Error(`Received a message with an unknown type: ${type}`);
        }
        return type;
    }
    applyQueryAwarenessMessage(document, reply) {
        const message = new OutgoingMessage(document.name)
            .createAwarenessUpdateMessage(document.awareness);
        if (reply) {
            reply(message.toUint8Array());
        }
        // TODO: We should add support for WebSocket connections, too, right?
        // this.logger.log({
        //   direction: 'out',
        //   type: MessageType.Sync,
        //   category: 'SyncStep1',
        // })
        // connection.send(syncMessage.toUint8Array())
    }
}

class Connection {
    /**
     * Constructor.
     */
    constructor(connection, request, document, timeout, socketId, context, readOnly = false, logger) {
        this.pongReceived = true;
        this.callbacks = {
            onClose: [(document, event) => null],
            beforeHandleMessage: (connection, update) => Promise,
            statelessCallback: () => Promise,
        };
        this.boundClose = this.close.bind(this);
        this.boundHandlePong = this.handlePong.bind(this);
        this.webSocket = connection;
        this.context = context;
        this.document = document;
        this.request = request;
        this.timeout = timeout;
        this.socketId = socketId;
        this.readOnly = readOnly;
        this.logger = logger;
        this.lock = new AsyncLock();
        this.webSocket.binaryType = 'arraybuffer';
        this.document.addConnection(this);
        this.pingInterval = setInterval(this.check.bind(this), this.timeout);
        this.webSocket.on('close', this.boundClose);
        this.webSocket.on('pong', this.boundHandlePong);
        this.sendCurrentAwareness();
    }
    handlePong() {
        this.pongReceived = true;
    }
    /**
     * Set a callback that will be triggered when the connection is closed
     */
    onClose(callback) {
        this.callbacks.onClose.push(callback);
        return this;
    }
    /**
     * Set a callback that will be triggered when an stateless message is received
     */
    onStatelessCallback(callback) {
        this.callbacks.statelessCallback = callback;
        return this;
    }
    /**
     * Set a callback that will be triggered before an message is handled
     */
    beforeHandleMessage(callback) {
        this.callbacks.beforeHandleMessage = callback;
        return this;
    }
    /**
     * Send the given message
     */
    send(message) {
        if (this.webSocket.readyState === WsReadyStates.Closing
            || this.webSocket.readyState === WsReadyStates.Closed) {
            this.close();
        }
        try {
            this.webSocket.send(message, (error) => {
                if (error != null)
                    this.close();
            });
        }
        catch (exception) {
            this.close();
        }
    }
    /**
     * Send a stateless message with payload
     */
    sendStateless(payload) {
        const message = new OutgoingMessage(this.document.name)
            .writeStateless(payload);
        this.logger.log({
            direction: 'out',
            type: message.type,
            category: message.category,
        });
        this.send(message.toUint8Array());
    }
    /**
     * Graceful wrapper around the WebSocket close method.
     */
    close(event) {
        this.lock.acquire('close', (done) => {
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
            }
            if (this.document.hasConnection(this)) {
                this.document.removeConnection(this);
                this.callbacks.onClose.forEach((callback) => callback(this.document, event));
            }
            this.webSocket.removeListener('close', this.boundClose);
            this.webSocket.removeListener('pong', this.boundHandlePong);
            done();
        });
    }
    /**
     * Check if pong was received and close the connection otherwise
     * @private
     */
    check() {
        if (!this.pongReceived) {
            return this.close(ConnectionTimeout);
        }
        if (this.document.hasConnection(this)) {
            this.pongReceived = false;
            try {
                this.webSocket.ping();
            }
            catch (error) {
                this.close(ConnectionTimeout);
            }
        }
    }
    /**
     * Send the current document awareness to the client, if any
     * @private
     */
    sendCurrentAwareness() {
        if (!this.document.hasAwarenessStates()) {
            return;
        }
        const awarenessMessage = new OutgoingMessage(this.document.name)
            .createAwarenessUpdateMessage(this.document.awareness);
        this.logger.log({
            direction: 'out',
            type: awarenessMessage.type,
            category: awarenessMessage.category,
        });
        this.send(awarenessMessage.toUint8Array());
    }
    /**
     * Handle an incoming message
     * @public
     */
    handleMessage(data) {
        const message = new IncomingMessage(data);
        const documentName = message.readVarString();
        if (documentName !== this.document.name)
            return;
        message.writeVarString(documentName);
        this.callbacks.beforeHandleMessage(this, data)
            .then(() => {
            new MessageReceiver(message, this.logger).apply(this.document, this);
        })
            .catch((e) => {
            console.log('closing connection because of exception', e);
            this.close({
                code: 'code' in e ? e.code : Forbidden.code,
                reason: 'reason' in e ? e.reason : Forbidden.reason,
            });
        });
    }
}

// import * as time from 'lib0/time'
class Debugger {
    constructor() {
        this.logs = [];
        this.listen = false;
        this.output = false;
    }
    enable() {
        this.flush();
        this.listen = true;
    }
    disable() {
        this.listen = false;
    }
    verbose() {
        this.output = true;
    }
    quiet() {
        this.output = false;
    }
    log(message) {
        if (!this.listen) {
            return this;
        }
        const item = {
            ...message,
            type: MessageType[message.type],
            // time: time.getUnixTime(),
        };
        this.logs.push(item);
        if (this.output) {
            console.log('[DEBUGGER]', item.direction === 'in' ? 'IN –>' : 'OUT <–', `${item.type}/${item.category}`);
        }
        return this;
    }
    flush() {
        this.logs = [];
        return this;
    }
    get() {
        return {
            logs: this.logs,
        };
    }
}

/**
 * Mutual exclude for JavaScript.
 *
 * @module mutex
 */

/**
 * @callback mutex
 * @param {function():void} cb Only executed when this mutex is not in the current stack
 * @param {function():void} [elseCb] Executed when this mutex is in the current stack
 */

/**
 * Creates a mutual exclude function with the following property:
 *
 * ```js
 * const mutex = createMutex()
 * mutex(() => {
 *   // This function is immediately executed
 *   mutex(() => {
 *     // This function is not executed, as the mutex is already active.
 *   })
 * })
 * ```
 *
 * @return {mutex} A mutual exclude function
 * @public
 */
const createMutex = () => {
  let token = true;
  return (f, g) => {
    if (token) {
      token = false;
      try {
        f();
      } finally {
        token = true;
      }
    } else if (g !== undefined) {
      g();
    }
  }
};

class Document extends Doc {
    /**
     * Constructor.
     */
    constructor(name, logger, yDocOptions) {
        super(yDocOptions);
        this.callbacks = {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onUpdate: (document, connection, update) => { },
            beforeBroadcastStateless: (document, stateless) => { },
        };
        this.connections = new Map();
        // The number of direct (non-websocket) connections to this document
        this.directConnectionsCount = 0;
        this.name = name;
        this.mux = createMutex();
        this.awareness = new Awareness(this);
        this.awareness.setLocalState(null);
        this.awareness.on('update', this.handleAwarenessUpdate.bind(this));
        this.on('update', this.handleUpdate.bind(this));
        this.logger = logger;
        this.isLoading = true;
    }
    /**
     * Check if the Document is empty
     */
    isEmpty(fieldName) {
        // eslint-disable-next-line no-underscore-dangle
        return !this.get(fieldName)._start;
    }
    /**
     * Merge the given document(s) into this one
     */
    merge(documents) {
        (Array.isArray(documents) ? documents : [documents]).forEach(document => {
            applyUpdate(this, encodeStateAsUpdate(document));
        });
        return this;
    }
    /**
     * Set a callback that will be triggered when the document is updated
     */
    onUpdate(callback) {
        this.callbacks.onUpdate = callback;
        return this;
    }
    /**
     * Set a callback that will be triggered before a stateless message is broadcasted
     */
    beforeBroadcastStateless(callback) {
        this.callbacks.beforeBroadcastStateless = callback;
        return this;
    }
    /**
     * Register a connection and a set of clients on this document keyed by the
     * underlying websocket connection
     */
    addConnection(connection) {
        this.connections.set(connection.webSocket, {
            clients: new Set(),
            connection,
        });
        return this;
    }
    /**
     * Is the given connection registered on this document
     */
    hasConnection(connection) {
        return this.connections.has(connection.webSocket);
    }
    /**
     * Remove the given connection from this document
     */
    removeConnection(connection) {
        removeAwarenessStates(this.awareness, Array.from(this.getClients(connection.webSocket)), null);
        this.connections.delete(connection.webSocket);
        return this;
    }
    addDirectConnection() {
        this.directConnectionsCount += 1;
        return this;
    }
    removeDirectConnection() {
        if (this.directConnectionsCount > 0) {
            this.directConnectionsCount -= 1;
        }
        return this;
    }
    /**
     * Get the number of active connections for this document
     */
    getConnectionsCount() {
        return this.connections.size + this.directConnectionsCount;
    }
    /**
     * Get an array of registered connections
     */
    getConnections() {
        return Array.from(this.connections.values()).map(data => data.connection);
    }
    /**
     * Get the client ids for the given connection instance
     */
    getClients(connectionInstance) {
        const connection = this.connections.get(connectionInstance);
        return (connection === null || connection === void 0 ? void 0 : connection.clients) === undefined ? new Set() : connection.clients;
    }
    /**
     * Has the document awareness states
     */
    hasAwarenessStates() {
        return this.awareness.getStates().size > 0;
    }
    /**
     * Apply the given awareness update
     */
    applyAwarenessUpdate(connection, update) {
        applyAwarenessUpdate(this.awareness, update, connection.webSocket);
        return this;
    }
    /**
     * Handle an awareness update and sync changes to clients
     * @private
     */
    handleAwarenessUpdate({ added, updated, removed }, connectionInstance) {
        const changedClients = added.concat(updated, removed);
        if (connectionInstance !== null) {
            const connection = this.connections.get(connectionInstance);
            if (connection) {
                added.forEach((clientId) => connection.clients.add(clientId));
                removed.forEach((clientId) => connection.clients.delete(clientId));
            }
        }
        this.getConnections().forEach(connection => {
            const awarenessMessage = new OutgoingMessage(this.name)
                .createAwarenessUpdateMessage(this.awareness, changedClients);
            this.logger.log({
                direction: 'out',
                type: awarenessMessage.type,
                category: awarenessMessage.category,
            });
            connection.send(awarenessMessage.toUint8Array());
        });
        return this;
    }
    /**
     * Handle an updated document and sync changes to clients
     */
    handleUpdate(update, connection) {
        this.callbacks.onUpdate(this, connection, update);
        const message = new OutgoingMessage(this.name)
            .createSyncMessage()
            .writeUpdate(update);
        this.getConnections().forEach(connection => {
            this.logger.log({
                direction: 'out',
                type: message.type,
                category: message.category,
            });
            connection.send(message.toUint8Array());
        });
        return this;
    }
    /**
     * Broadcast stateless message to all connections
     */
    broadcastStateless(payload) {
        this.callbacks.beforeBroadcastStateless(this, payload);
        this.getConnections().forEach(connection => {
            connection.sendStateless(payload);
        });
    }
}

var name = "@hocuspocus/server";
var description = "plug & play collaboration backend";
var version = "2.3.1";
var homepage = "https://hocuspocus.dev";
var keywords = [
	"hocuspocus",
	"yjs",
	"yjs-websocket",
	"prosemirror"
];
var license = "MIT";
var type = "module";
var main = "dist/hocuspocus-server.cjs";
var module = "dist/hocuspocus-server.esm.js";
var types = "dist/packages/server/src/index.d.ts";
var exports = {
	source: {
		"import": "./src"
	},
	"default": {
		"import": "./dist/hocuspocus-server.esm.js",
		require: "./dist/hocuspocus-server.cjs",
		types: "./dist/packages/server/src/index.d.ts"
	}
};
var files = [
	"src",
	"dist"
];
var dependencies = {
	"@hocuspocus/common": "^2.3.1",
	"async-lock": "^1.3.1",
	kleur: "^4.1.4",
	lib0: "^0.2.47",
	uuid: "^9.0.0",
	ws: "^8.5.0"
};
var devDependencies = {
	"@types/async-lock": "^1.1.3",
	"@types/uuid": "^9.0.0",
	"@types/ws": "^8.5.3"
};
var peerDependencies = {
	"y-protocols": "^1.0.5",
	yjs: "^13.6.4"
};
var gitHead = "b3454a4ca289a84ddfb7fa5607a2d4b8d5c37e9d";
var meta = {
	name: name,
	description: description,
	version: version,
	homepage: homepage,
	keywords: keywords,
	license: license,
	type: type,
	main: main,
	module: module,
	types: types,
	exports: exports,
	files: files,
	dependencies: dependencies,
	devDependencies: devDependencies,
	peerDependencies: peerDependencies,
	gitHead: gitHead
};

/**
   * Get parameters by the given request
   */
function getParameters(request) {
    var _a;
    const query = ((_a = request === null || request === void 0 ? void 0 : request.url) === null || _a === void 0 ? void 0 : _a.split('?')) || [];
    return new URLSearchParams(query[1] ? query[1] : '');
}

/**
 * The `ClientConnection` class is responsible for handling an incoming WebSocket
 *
 * TODO-refactor:
 * - use event handlers instead of calling hooks directly, hooks should probably be called from Hocuspocus.ts
 */
class ClientConnection {
    /**
      * The `ClientConnection` class receives incoming WebSocket connections,
      * runs all hooks:
      *
      *  - onConnect for all connections
      *  - onAuthenticate only if required
      *
      * … and if nothings fails it’ll fully establish the connection and
      * load the Document then.
      */
    constructor(websocket, request, documentProvider, 
    // TODO: change to events
    hooks, debuggerTool, opts, defaultContext = {}) {
        this.websocket = websocket;
        this.request = request;
        this.documentProvider = documentProvider;
        this.hooks = hooks;
        this.debuggerTool = debuggerTool;
        this.opts = opts;
        this.defaultContext = defaultContext;
        // this map indicates whether a `Connection` instance has already taken over for incoming message for the key (i.e. documentName)
        this.documentConnections = {};
        this.connections = {};
        // While the connection will be establishing messages will
        // be queued and handled later.
        this.incomingMessageQueue = {};
        // While the connection is establishing, kee
        this.documentConnectionsEstablished = new Set();
        // hooks payload by Document
        this.hookPayloads = {};
        this.callbacks = {
            onClose: [(document, payload) => { }],
        };
        // Every new connection gets a unique identifier.
        this.socketId = v4();
        // Once all hooks are run, we’ll fully establish the connection:
        this.setUpNewConnection = async (documentName) => {
            // Not an idle connection anymore, no need to close it then.
            clearTimeout(this.closeIdleConnectionTimeout);
            const hookPayload = this.hookPayloads[documentName];
            // If no hook interrupts, create a document and connection
            const document = await this.documentProvider.createDocument(documentName, hookPayload.request, hookPayload.socketId, hookPayload.connection, hookPayload.context);
            const instance = this.createConnection(this.websocket, document);
            instance.onClose((document, event) => {
                delete this.hookPayloads[documentName];
                delete this.documentConnections[documentName];
                delete this.incomingMessageQueue[documentName];
                this.documentConnectionsEstablished.delete(documentName);
                if (Object.keys(this.documentConnections).length === 0) {
                    instance.webSocket.close(event === null || event === void 0 ? void 0 : event.code, event === null || event === void 0 ? void 0 : event.reason); // TODO: Move this to Hocuspocus connection handler
                }
            });
            this.documentConnections[documentName] = true;
            // There’s no need to queue messages anymore.
            // Let’s work through queued messages.
            this.incomingMessageQueue[documentName].forEach(input => {
                this.websocket.emit('message', input);
            });
            this.hooks('connected', {
                ...hookPayload,
                documentName,
                context: hookPayload.context,
                connectionInstance: instance,
            });
        };
        // This listener handles authentication messages and queues everything else.
        this.handleQueueingMessage = async (data) => {
            var _a;
            try {
                const tmpMsg = new IncomingMessage(data);
                const documentName = readVarString(tmpMsg.decoder);
                const type = readVarUint(tmpMsg.decoder);
                if (!(type === MessageType.Auth && !this.documentConnectionsEstablished.has(documentName))) {
                    this.incomingMessageQueue[documentName].push(data);
                    return;
                }
                // Okay, we’ve got the authentication message we’re waiting for:
                this.documentConnectionsEstablished.add(documentName);
                // The 2nd integer contains the submessage type
                // which will always be authentication when sent from client -> server
                readVarUint(tmpMsg.decoder);
                const token = readVarString(tmpMsg.decoder);
                this.debuggerTool.log({
                    direction: 'in',
                    type,
                    category: 'Token',
                });
                try {
                    const hookPayload = this.hookPayloads[documentName];
                    await this.hooks('onAuthenticate', {
                        token,
                        ...hookPayload,
                        documentName,
                    }, (contextAdditions) => {
                        // Hooks are allowed to give us even more context and we’ll merge everything together.
                        // We’ll pass the context to other hooks then.
                        hookPayload.context = { ...hookPayload.context, ...contextAdditions };
                    });
                    // All `onAuthenticate` hooks passed.
                    hookPayload.connection.isAuthenticated = true;
                    // Let the client know that authentication was successful.
                    const message = new OutgoingMessage(documentName).writeAuthenticated(hookPayload.connection.readOnly);
                    this.debuggerTool.log({
                        direction: 'out',
                        type: message.type,
                        category: message.category,
                    });
                    this.websocket.send(message.toUint8Array());
                    // Time to actually establish the connection.
                    await this.setUpNewConnection(documentName);
                }
                catch (err) {
                    const error = err || Forbidden;
                    const message = new OutgoingMessage(documentName).writePermissionDenied((_a = error.reason) !== null && _a !== void 0 ? _a : 'permission-denied');
                    this.debuggerTool.log({
                        direction: 'out',
                        type: message.type,
                        category: message.category,
                    });
                    // Ensure that the permission denied message is sent before the
                    // connection is closed
                    this.websocket.send(message.toUint8Array(), () => {
                        var _a, _b;
                        if (Object.keys(this.documentConnections).length === 0) {
                            try {
                                this.websocket.close((_a = error.code) !== null && _a !== void 0 ? _a : Forbidden.code, (_b = error.reason) !== null && _b !== void 0 ? _b : Forbidden.reason);
                            }
                            catch (closeError) {
                                // catch is needed in case invalid error code is returned by hook (that would fail sending the close message)
                                console.error(closeError);
                                this.websocket.close(Forbidden.code, Forbidden.reason);
                            }
                        }
                    });
                }
                // Catch errors due to failed decoding of data
            }
            catch (error) {
                console.error(error);
                this.websocket.close(Unauthorized.code, Unauthorized.reason);
            }
        };
        this.messageHandler = async (data) => {
            var _a, _b;
            try {
                const tmpMsg = new IncomingMessage(data);
                const documentName = readVarString(tmpMsg.decoder);
                const instance = this.connections[documentName];
                if (instance) {
                    instance.handleMessage(data);
                }
                if (this.documentConnections[documentName] === true) {
                    // we already have a `Connection` set up for this document
                    return;
                }
                const isFirst = this.incomingMessageQueue[documentName] === undefined;
                if (isFirst) {
                    this.incomingMessageQueue[documentName] = [];
                    if (this.hookPayloads[documentName]) {
                        throw new Error('first message, but hookPayloads exists');
                    }
                    const hookPayload = {
                        instance: this.documentProvider,
                        request: this.request,
                        connection: {
                            readOnly: false,
                            requiresAuthentication: this.opts.requiresAuthentication,
                            isAuthenticated: false,
                        },
                        requestHeaders: this.request.headers,
                        requestParameters: getParameters(this.request),
                        socketId: this.socketId,
                        context: {
                            ...this.defaultContext,
                        },
                    };
                    this.hookPayloads[documentName] = hookPayload;
                }
                this.handleQueueingMessage(data);
                if (isFirst) {
                    const hookPayload = this.hookPayloads[documentName];
                    // if this is the first message, trigger onConnect & check if we can start the connection (only if no auth is required)
                    try {
                        await this.hooks('onConnect', { ...hookPayload, documentName }, (contextAdditions) => {
                            // merge context from all hooks
                            hookPayload.context = { ...hookPayload.context, ...contextAdditions };
                        });
                        if (hookPayload.connection.requiresAuthentication || this.documentConnectionsEstablished.has(documentName)) {
                            // Authentication is required, we’ll need to wait for the Authentication message.
                            return;
                        }
                        this.documentConnectionsEstablished.add(documentName);
                        await this.setUpNewConnection(documentName);
                    }
                    catch (err) {
                        // if a hook interrupts, close the websocket connection
                        const error = err || Forbidden;
                        try {
                            this.websocket.close((_a = error.code) !== null && _a !== void 0 ? _a : Forbidden.code, (_b = error.reason) !== null && _b !== void 0 ? _b : Forbidden.reason);
                        }
                        catch (closeError) {
                            // catch is needed in case invalid error code is returned by hook (that would fail sending the close message)
                            console.error(closeError);
                            this.websocket.close(Unauthorized.code, Unauthorized.reason);
                        }
                    }
                }
            }
            catch (closeError) {
                // catch is needed in case an invalid payload crashes the parsing of the Uint8Array
                console.error(closeError);
                this.websocket.close(Unauthorized.code, Unauthorized.reason);
            }
        };
        // Make sure to close an idle connection after a while.
        this.closeIdleConnectionTimeout = setTimeout(() => {
            websocket.close(Unauthorized.code, Unauthorized.reason);
        }, opts.timeout);
        websocket.on('message', this.messageHandler);
    }
    /**
     * Set a callback that will be triggered when the connection is closed
     */
    onClose(callback) {
        this.callbacks.onClose.push(callback);
        return this;
    }
    /**
     * Create a new connection by the given request and document
     */
    createConnection(connection, document) {
        const hookPayload = this.hookPayloads[document.name];
        const instance = new Connection(connection, hookPayload.request, document, this.opts.timeout, hookPayload.socketId, hookPayload.context, hookPayload.connection.readOnly, this.debuggerTool);
        this.connections[document.name] = instance;
        instance.onClose(async (document, event) => {
            const disconnectHookPayload = {
                instance: this.documentProvider,
                clientsCount: document.getConnectionsCount(),
                context: hookPayload.context,
                document,
                socketId: hookPayload.socketId,
                documentName: document.name,
                requestHeaders: hookPayload.request.headers,
                requestParameters: getParameters(hookPayload.request),
            };
            delete this.connections[document.name];
            await this.hooks('onDisconnect', disconnectHookPayload);
            this.callbacks.onClose.forEach((callback => callback(document, disconnectHookPayload)));
        });
        instance.onStatelessCallback(async (payload) => {
            try {
                return await this.hooks('onStateless', payload);
            }
            catch (error) {
                // TODO: weird pattern, what's the use of this?
                if (error === null || error === void 0 ? void 0 : error.message) {
                    throw error;
                }
            }
        });
        instance.beforeHandleMessage((connection, update) => {
            const beforeHandleMessagePayload = {
                instance: this.documentProvider,
                clientsCount: document.getConnectionsCount(),
                context: hookPayload.context,
                document,
                socketId: hookPayload.socketId,
                connection,
                documentName: document.name,
                requestHeaders: hookPayload.request.headers,
                requestParameters: getParameters(hookPayload.request),
                update,
            };
            return this.hooks('beforeHandleMessage', beforeHandleMessagePayload);
        });
        // If the WebSocket has already disconnected (wow, that was fast) – then
        // immediately call close to cleanup the connection and document in memory.
        if (connection.readyState === WsReadyStates.Closing
            || connection.readyState === WsReadyStates.Closed) {
            instance.close();
        }
        return instance;
    }
}

class DirectConnection {
    /**
     * Constructor.
     */
    constructor(document, instance, context) {
        this.document = null;
        this.document = document;
        this.instance = instance;
        this.context = context;
        this.document.addDirectConnection();
    }
    async transact(transaction) {
        if (!this.document) {
            throw new Error('direct connection closed');
        }
        transaction(this.document);
        this.instance.storeDocumentHooks(this.document, {
            clientsCount: this.document.getConnectionsCount(),
            context: this.context,
            document: this.document,
            documentName: this.document.name,
            instance: this.instance,
            requestHeaders: {},
            requestParameters: new URLSearchParams(),
            socketId: 'server',
        });
    }
    disconnect() {
        var _a;
        (_a = this.document) === null || _a === void 0 ? void 0 : _a.removeDirectConnection();
        this.document = null;
    }
}

const defaultConfiguration = {
    name: null,
    port: 80,
    address: '0.0.0.0',
    timeout: 30000,
    debounce: 2000,
    maxDebounce: 10000,
    quiet: false,
    yDocOptions: {
        gc: true,
        gcFilter: () => true,
    },
};
/**
 * Hocuspocus Server
 */
class Hocuspocus {
    constructor(configuration) {
        this.configuration = {
            ...defaultConfiguration,
            extensions: [],
            onConfigure: () => new Promise(r => r(null)),
            onListen: () => new Promise(r => r(null)),
            onUpgrade: () => new Promise(r => r(null)),
            onConnect: () => new Promise(r => r(null)),
            connected: () => new Promise(r => r(null)),
            beforeHandleMessage: () => new Promise(r => r(null)),
            beforeBroadcastStateless: () => new Promise(r => r(null)),
            onStateless: () => new Promise(r => r(null)),
            onChange: () => new Promise(r => r(null)),
            onLoadDocument: () => new Promise(r => r(null)),
            onStoreDocument: () => new Promise(r => r(null)),
            afterStoreDocument: () => new Promise(r => r(null)),
            onAwarenessUpdate: () => new Promise(r => r(null)),
            onRequest: () => new Promise(r => r(null)),
            onDisconnect: () => new Promise(r => r(null)),
            onDestroy: () => new Promise(r => r(null)),
        };
        this.documents = new Map();
        this.debugger = new Debugger();
        this.timers = new Map();
        if (configuration) {
            this.configure(configuration);
        }
    }
    /**
     * Configure the server
     */
    configure(configuration) {
        this.configuration = {
            ...this.configuration,
            ...configuration,
        };
        this.configuration.extensions.sort((a, b) => {
            const one = typeof a.priority === 'undefined' ? 100 : a.priority;
            const two = typeof b.priority === 'undefined' ? 100 : b.priority;
            if (one > two) {
                return -1;
            }
            if (one < two) {
                return 1;
            }
            return 0;
        });
        this.configuration.extensions.push({
            onConfigure: this.configuration.onConfigure,
            onListen: this.configuration.onListen,
            onUpgrade: this.configuration.onUpgrade,
            onConnect: this.configuration.onConnect,
            connected: this.configuration.connected,
            onAuthenticate: this.configuration.onAuthenticate,
            onLoadDocument: this.configuration.onLoadDocument,
            beforeHandleMessage: this.configuration.beforeHandleMessage,
            beforeBroadcastStateless: this.configuration.beforeBroadcastStateless,
            onStateless: this.configuration.onStateless,
            onChange: this.configuration.onChange,
            onStoreDocument: this.configuration.onStoreDocument,
            afterStoreDocument: this.configuration.afterStoreDocument,
            onAwarenessUpdate: this.configuration.onAwarenessUpdate,
            onRequest: this.configuration.onRequest,
            onDisconnect: this.configuration.onDisconnect,
            onDestroy: this.configuration.onDestroy,
        });
        this.hooks('onConfigure', {
            configuration: this.configuration,
            version: meta.version,
            instance: this,
        });
        return this;
    }
    get requiresAuthentication() {
        return !!this.configuration.extensions.find(extension => {
            return extension.onAuthenticate !== undefined;
        });
    }
    /**
     * Start the server
     */
    async listen(portOrCallback = null, callback = null) {
        if (typeof portOrCallback === 'number') {
            this.configuration.port = portOrCallback;
        }
        if (typeof portOrCallback === 'function') {
            this.configuration.extensions.push({
                onListen: portOrCallback,
            });
        }
        if (typeof callback === 'function') {
            this.configuration.extensions.push({
                onListen: callback,
            });
        }
        const webSocketServer = new WebSocketServer({ noServer: true });
        webSocketServer.on('connection', async (incoming, request) => {
            incoming.on('error', error => {
                /**
                 * Handle a ws instance error, which is required to prevent
                 * the server from crashing when one happens
                 * See https://github.com/websockets/ws/issues/1777#issuecomment-660803472
                 * @private
                 */
                this.debugger.log('Error emitted from webSocket instance:');
                this.debugger.log(error);
            });
            this.handleConnection(incoming, request);
        });
        const server = createServer(async (request, response) => {
            try {
                await this.hooks('onRequest', { request, response, instance: this });
                // default response if all prior hooks don't interfere
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end('OK');
            }
            catch (error) {
                // if a hook rejects and the error is empty, do nothing
                // this is only meant to prevent later hooks and the
                // default handler to do something. if a error is present
                // just rethrow it
                if (error) {
                    throw error;
                }
            }
        });
        server.on('upgrade', async (request, socket, head) => {
            try {
                await this.hooks('onUpgrade', {
                    request,
                    socket,
                    head,
                    instance: this,
                });
                // let the default websocket server handle the connection if
                // prior hooks don't interfere
                webSocketServer.handleUpgrade(request, socket, head, ws => {
                    webSocketServer.emit('connection', ws, request);
                });
            }
            catch (error) {
                // if a hook rejects and the error is empty, do nothing
                // this is only meant to prevent later hooks and the
                // default handler to do something. if a error is present
                // just rethrow it
                // TODO: why?
                if (error) {
                    throw error;
                }
            }
        });
        this.httpServer = server;
        this.webSocketServer = webSocketServer;
        return new Promise((resolve, reject) => {
            server.listen({
                port: this.configuration.port,
                host: this.configuration.address,
            }, async () => {
                if (!this.configuration.quiet && process.env.NODE_ENV !== 'testing') {
                    this.showStartScreen();
                }
                const onListenPayload = {
                    instance: this,
                    configuration: this.configuration,
                    port: this.address.port,
                };
                try {
                    await this.hooks('onListen', onListenPayload);
                    resolve(this);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    get address() {
        var _a;
        return (((_a = this.httpServer) === null || _a === void 0 ? void 0 : _a.address()) || {
            port: this.configuration.port,
            address: this.configuration.address,
            family: 'IPv4',
        });
    }
    get URL() {
        return `${this.configuration.address}:${this.address.port}`;
    }
    get webSocketURL() {
        return `ws://${this.URL}`;
    }
    get httpURL() {
        return `http://${this.URL}`;
    }
    showStartScreen() {
        var _a;
        const name = this.configuration.name ? ` (${this.configuration.name})` : '';
        console.log();
        console.log(`  ${kleur.cyan(`Hocuspocus v${meta.version}${name}`)}${kleur.green(' running at:')}`);
        console.log();
        console.log(`  > HTTP: ${kleur.cyan(`${this.httpURL}`)}`);
        console.log(`  > WebSocket: ${this.webSocketURL}`);
        const extensions = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.extensions.map(extension => {
            var _a;
            return (_a = extension.constructor) === null || _a === void 0 ? void 0 : _a.name;
        }).filter(name => name).filter(name => name !== 'Object');
        if (!extensions.length) {
            return;
        }
        console.log();
        console.log('  Extensions:');
        extensions
            .forEach(name => {
            console.log(`  - ${name}`);
        });
        console.log();
        console.log(`  ${kleur.green('Ready.')}`);
        console.log();
    }
    /**
     * Get the total number of active documents
     */
    getDocumentsCount() {
        return this.documents.size;
    }
    /**
     * Get the total number of active connections
     */
    getConnectionsCount() {
        return Array.from(this.documents.values()).reduce((acc, document) => {
            acc += document.getConnectionsCount();
            return acc;
        }, 0);
    }
    /**
     * Force close one or more connections
     */
    closeConnections(documentName) {
        // Iterate through all connections for all documents
        // and invoke their close method, which is a graceful
        // disconnect wrapper around the underlying websocket.close
        this.documents.forEach((document) => {
            // If a documentName was specified, bail if it doesnt match
            if (documentName && document.name !== documentName) {
                return;
            }
            document.connections.forEach(({ connection }) => {
                connection.close(ResetConnection);
            });
        });
    }
    /**
     * Destroy the server
     */
    async destroy() {
        var _a, _b, _c;
        (_a = this.httpServer) === null || _a === void 0 ? void 0 : _a.close();
        try {
            (_b = this.webSocketServer) === null || _b === void 0 ? void 0 : _b.close();
            (_c = this.webSocketServer) === null || _c === void 0 ? void 0 : _c.clients.forEach(client => {
                client.terminate();
            });
        }
        catch (error) {
            console.error(error);
            //
        }
        this.debugger.flush();
        await this.hooks('onDestroy', { instance: this });
    }
    /**
     * The `handleConnection` method receives incoming WebSocket connections,
     * runs all hooks:
     *
     *  - onConnect for all connections
     *  - onAuthenticate only if required
     *
     * … and if nothings fails it’ll fully establish the connection and
     * load the Document then.
     */
    handleConnection(incoming, request, defaultContext = {}) {
        const clientConnection = new ClientConnection(incoming, request, this, this.hooks.bind(this), this.debugger, {
            requiresAuthentication: this.requiresAuthentication,
            timeout: this.configuration.timeout,
        }, defaultContext);
        clientConnection.onClose((document, hookPayload) => {
            // Check if there are still no connections to the document, as these hooks
            // may take some time to resolve (e.g. database queries). If a
            // new connection were to come in during that time it would rely on the
            // document in the map that we remove now.
            if (document.getConnectionsCount() > 0) {
                return;
            }
            // If it’s the last connection, we need to make sure to store the
            // document. Use the debounce helper, to clear running timers,
            // but make it run immediately (`true`).
            // Only run this if the document has finished loading earlier (i.e. not to persist the empty
            // ydoc if the onLoadDocument hook returned an error)
            if (!document.isLoading) {
                this.debounce(`onStoreDocument-${document.name}`, () => {
                    this.storeDocumentHooks(document, hookPayload);
                }, true);
            }
            else {
                // Remove document from memory immediately
                this.unloadDocument(document);
            }
        });
    }
    /**
     * Handle update of the given document
     */
    handleDocumentUpdate(document, connection, update, request) {
        var _a, _b;
        const hookPayload = {
            instance: this,
            clientsCount: document.getConnectionsCount(),
            context: (connection === null || connection === void 0 ? void 0 : connection.context) || {},
            document,
            documentName: document.name,
            requestHeaders: (_a = request === null || request === void 0 ? void 0 : request.headers) !== null && _a !== void 0 ? _a : {},
            requestParameters: getParameters(request),
            socketId: (_b = connection === null || connection === void 0 ? void 0 : connection.socketId) !== null && _b !== void 0 ? _b : '',
            update,
        };
        this.hooks('onChange', hookPayload).catch(error => {
            // TODO: what's the intention of this catch -> throw?
            throw error;
        });
        // If the update was received through other ways than the
        // WebSocket connection, we don’t need to feel responsible for
        // storing the content.
        if (!connection) {
            return;
        }
        this.debounce(`onStoreDocument-${document.name}`, () => {
            this.storeDocumentHooks(document, hookPayload);
        });
    }
    /**
     * debounce the given function, using the given identifier
     */
    debounce(id, func, immediately = false) {
        const old = this.timers.get(id);
        const start = (old === null || old === void 0 ? void 0 : old.start) || Date.now();
        const run = () => {
            this.timers.delete(id);
            func();
        };
        if (old === null || old === void 0 ? void 0 : old.timeout) {
            clearTimeout(old.timeout);
        }
        if (immediately) {
            return run();
        }
        if (Date.now() - start >= this.configuration.maxDebounce) {
            return run();
        }
        this.timers.set(id, {
            start,
            timeout: setTimeout(run, this.configuration.debounce),
        });
    }
    /**
     * Create a new document by the given request
     */
    async createDocument(documentName, request, socketId, connection, context) {
        var _a;
        if (this.documents.has(documentName)) {
            const document = this.documents.get(documentName);
            if (document) {
                return document;
            }
        }
        const document = new Document(documentName, this.debugger, this.configuration.yDocOptions);
        this.documents.set(documentName, document);
        const hookPayload = {
            instance: this,
            context,
            connection,
            document,
            documentName,
            socketId,
            requestHeaders: (_a = request.headers) !== null && _a !== void 0 ? _a : {},
            requestParameters: getParameters(request),
        };
        try {
            await this.hooks('onLoadDocument', hookPayload, (loadedDocument) => {
                // if a hook returns a Y-Doc, encode the document state as update
                // and apply it to the newly created document
                // Note: instanceof doesn't work, because Doc !== Doc for some reason I don't understand
                if ((loadedDocument === null || loadedDocument === void 0 ? void 0 : loadedDocument.constructor.name) === 'Document'
                    || (loadedDocument === null || loadedDocument === void 0 ? void 0 : loadedDocument.constructor.name) === 'Doc') {
                    applyUpdate(document, encodeStateAsUpdate(loadedDocument));
                }
            });
        }
        catch (e) {
            this.closeConnections(documentName);
            this.unloadDocument(document);
            throw e;
        }
        document.isLoading = false;
        await this.hooks('afterLoadDocument', hookPayload);
        document.onUpdate((document, connection, update) => {
            this.handleDocumentUpdate(document, connection, update, connection === null || connection === void 0 ? void 0 : connection.request);
        });
        document.beforeBroadcastStateless((document, stateless) => {
            const hookPayload = {
                document,
                documentName: document.name,
                payload: stateless,
            };
            this.hooks('beforeBroadcastStateless', hookPayload);
        });
        document.awareness.on('update', (update) => {
            this.hooks('onAwarenessUpdate', {
                ...hookPayload,
                ...update,
                awareness: document.awareness,
                states: awarenessStatesToArray(document.awareness.getStates()),
            });
        });
        return document;
    }
    storeDocumentHooks(document, hookPayload) {
        this.hooks('onStoreDocument', hookPayload)
            .catch(error => {
            if (error === null || error === void 0 ? void 0 : error.message) {
                throw error;
            }
        })
            .then(() => {
            this.hooks('afterStoreDocument', hookPayload).then(() => {
                // Remove document from memory.
                if (document.getConnectionsCount() > 0) {
                    return;
                }
                this.unloadDocument(document);
            });
        });
    }
    /**
     * Run the given hook on all configured extensions.
     * Runs the given callback after each hook.
     */
    hooks(name, payload, callback = null) {
        const { extensions } = this.configuration;
        // create a new `thenable` chain
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
        let chain = Promise.resolve();
        extensions
            // get me all extensions which have the given hook
            .filter(extension => typeof extension[name] === 'function')
            // run through all the configured hooks
            .forEach(extension => {
            chain = chain
                .then(() => { var _a; return (_a = extension[name]) === null || _a === void 0 ? void 0 : _a.call(extension, payload); })
                .catch(error => {
                // make sure to log error messages
                if (error === null || error === void 0 ? void 0 : error.message) {
                    console.error(`[${name}]`, error.message);
                }
                throw error;
            });
            if (callback) {
                chain = chain.then((...args) => callback(...args));
            }
        });
        return chain;
    }
    unloadDocument(document) {
        const documentName = document.name;
        if (!this.documents.has(documentName))
            return;
        this.documents.delete(documentName);
        document.destroy();
        this.hooks('afterUnloadDocument', { instance: this, documentName });
    }
    enableDebugging() {
        this.debugger.enable();
    }
    enableMessageLogging() {
        this.debugger.enable();
        this.debugger.verbose();
    }
    disableLogging() {
        this.debugger.quiet();
    }
    disableDebugging() {
        this.debugger.disable();
    }
    flushMessageLogs() {
        this.debugger.flush();
        return this;
    }
    getMessageLogs() {
        var _a;
        return (_a = this.debugger.get()) === null || _a === void 0 ? void 0 : _a.logs;
    }
    async openDirectConnection(documentName, context) {
        const connectionConfig = {
            isAuthenticated: true,
            readOnly: false,
            requiresAuthentication: true,
        };
        const document = await this.createDocument(documentName, {}, // direct connection has no request params
        v4(), connectionConfig, context);
        return new DirectConnection(document, this, context);
    }
}
const Server = new Hocuspocus();

export { Connection, Debugger, Document, Hocuspocus, IncomingMessage, MessageReceiver, MessageType, OutgoingMessage, Server, defaultConfiguration };
//# sourceMappingURL=hocuspocus-server.esm.js.map
