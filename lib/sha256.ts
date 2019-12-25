import {Hash} from "./base/hash";
import {HMAC} from "./hmac";

export const digestLength: u32 = 32;
export const blockSize: u32 = 64;

// SHA-256 constants
const K:u32[]=[
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]



function hashBlocks(w: Int32Array, v: Int32Array, p: Uint8Array, pos: u32, len: u32): u32 {

    let a: i32, b: i32, c: i32, d: i32, e: i32,
        f: i32, g: i32, h: i32, u: i32, i: i32,
        j: i32, t1: i32, t2: i32;
    while (len >= 64) {
        a = v[0];
        b = v[1];
        c = v[2];
        d = v[3];
        e = v[4];
        f = v[5];
        g = v[6];
        h = v[7];

        for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (((<i32>p[j] & 0xff) << 24) | ((<i32>p[j + 1] & 0xff) << 16) |
                ((<i32>p[j + 2] & 0xff) <<  8) | (<i32>p[j + 3] & 0xff));
        }

        // for(let i=0;i<w.length;i++){
        //     trace('debug',1,w[i]);
        // }

        for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);

            u = w[i - 15];
            t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);

            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
        }

        for (i = 0; i < 64; i++) {
            t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
                (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
                ((h + ((K[i] + w[i]) | 0)) | 0)) | 0;

            t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
                (a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;

            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }

        v[0] =v[0]+a;
        v[1] =v[1]+b;
        v[2] =v[2]+c;
        v[3] =v[3]+d;
        v[4] =v[4]+e;
        v[5] =v[5]+f;
        v[6] =v[6]+g;
        v[7] =v[7]+h;

        pos += 64;
        len -= 64;
    }
    return pos;
}

// Hash implements SHA256 hash algorithm.
export class Sha256 extends Hash{
    // digestLength: u32 = digestLength;
    // blockSize: u32 = blockSize;

    // Note: Int32Array is used instead of Uint32Array for performance reasons.
    private state: Int32Array = new Int32Array(8); // hash state
    private temp: Int32Array = new Int32Array(64); // temporary state
    private buffer: Uint8Array = new Uint8Array(128); // buffer for data to hash
    private bufferLength: u32  = 0; // u32 of bytes in buffer
    private bytesHashed: u32 = 0; // u32 of total bytes hashed

    // finished: boolean = false; // indicates whether the hash was finalized

    constructor() {
        super();
        this.digestLength=digestLength;
        this.blockSize=blockSize;
        this.reset();
    }

    // Resets hash state making it possible
    // to re-use this instance to hash other data.
    reset(): this {
        this.state[0] = 0x6a09e667;
        this.state[1] = 0xbb67ae85;
        this.state[2] = 0x3c6ef372;
        this.state[3] = 0xa54ff53a;
        this.state[4] = 0x510e527f;
        this.state[5] = 0x9b05688c;
        this.state[6] = 0x1f83d9ab;
        this.state[7] = 0x5be0cd19;
        this.bufferLength = 0;
        this.bytesHashed = 0;
        this.finished = false;
        return this;
    }

    // Cleans internal buffers and re-initializes hash state.
    clean():void {
        for (let i = 0; i < this.buffer.length; i++) {
            this.buffer[i] = 0;
        }
        for (let i = 0; i < this.temp.length; i++) {
            this.temp[i] = 0;
        }
        this.reset();
    }

    // Updates hash state with the given data.
    //
    // Optionally, length of the data can be specified to hash
    // fewer bytes than data.length.
    //
    // Throws error when trying to update already finalized hash:
    // instance must be reset to use it again.
    update(data: Uint8Array, dataLength: u32 = data.length): this {
        if (this.finished) {
            throw new Error("SHA256: can't update because hash was finished.");
        }
        let dataPos:u32 = 0;
        this.bytesHashed += dataLength;
        if (this.bufferLength > 0) {
            while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
            }
            if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
            }
        }
        if (dataLength >= 64) {
            dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
            dataLength %= 64;
        }
        while (dataLength > 0) {
            this.buffer[this.bufferLength++] = data[dataPos++];
            dataLength--;
        }
        return this;
    }

    // Finalizes hash state and puts hash into out.
    //
    // If hash was already finalized, puts the same value.
    finish(out: Uint8Array): this {
        if (!this.finished) {
            const bytesHashed:u32 = this.bytesHashed;
            const left:u32 = this.bufferLength;
            const bitLenHi:u32 = (bytesHashed / 0x20000000) | 0;
            const bitLenLo:u32 = bytesHashed << 3;
            const padLength:u32 = (bytesHashed % 64 < 56) ? 64 : 128;

            this.buffer[left] = 0x80;
            for (let i:u32 = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
            }
            this.buffer[padLength - 8] = (bitLenHi >>> 24) & 0xff;
            this.buffer[padLength - 7] = (bitLenHi >>> 16) & 0xff;
            this.buffer[padLength - 6] = (bitLenHi >>>  8) & 0xff;
            this.buffer[padLength - 5] = (bitLenHi >>>  0) & 0xff;
            this.buffer[padLength - 4] = (bitLenLo >>> 24) & 0xff;
            this.buffer[padLength - 3] = (bitLenLo >>> 16) & 0xff;
            this.buffer[padLength - 2] = (bitLenLo >>>  8) & 0xff;
            this.buffer[padLength - 1] = (bitLenLo >>>  0) & 0xff;

            // for(let i=0;i<this.temp.length;i++){
            //     trace('debug',1,this.temp[i]);
            // }

            hashBlocks(this.temp, this.state, this.buffer, 0, padLength);

            // for(let i=0;i<this.state.length;i++){
            //     trace('debug',1,this.state[i]);
            // }
            this.finished = true;
        }

        for (let i = 0; i < 8; i++) {
            out[i * 4 + 0] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>>  8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>>  0) & 0xff;
        }

        return this;
    }

    // Returns the final hash digest.
    digest(): Uint8Array {
        const out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    }

    // Internal function for use in HMAC for optimization.
    saveState(out: Uint32Array):void{
        for (let i = 0; i < this.state.length; i++) {
            out[i] = this.state[i];
        }
    }

    // Internal function for use in HMAC for optimization.
    restoreState(from: Uint32Array, bytesHashed: u32):void{
        for (let i = 0; i < this.state.length; i++) {
            this.state[i] = from[i];
        }
        this.bytesHashed = bytesHashed;
        this.finished = false;
        this.bufferLength = 0;
    }
}



// Returns SHA256 hash of data.
export function hash(data: Uint8Array): Uint8Array {
    const h = (new Sha256()).update(data);
    const digest = h.digest();
    h.clean();
    return digest;
}

// Returns HMAC-SHA256 of data under the key.
export function hmac(key: Uint8Array, data: Uint8Array):Uint8Array{
    const h = (new HMAC<Sha256>(instance,key)).update(data);
    const digest = h.digest();
    h.clean();
    return digest;
}

function instance():Sha256 {
    return new Sha256();
}

// Derives a key from password and salt using PBKDF2-HMAC-SHA256
// with the given u32 of iterations.
//
// The u32 of bytes returned is equal to dkLen.
//
// (For better security, avoid dkLen greater than hash length - 32 bytes).
export function pbkdf2(password: Uint8Array, salt: Uint8Array, iterations: u32, dkLen: u32) :Uint8Array{
    const prf = new HMAC<Sha256>(instance,password);
    const len:u32 = prf.digestLength;
    const ctr = new Uint8Array(4);
    const t = new Uint8Array(len);
    const u = new Uint8Array(len);
    const dk = new Uint8Array(dkLen);

    for (let i:u32 = 0; i * len < dkLen; i++) {
        let c = i + 1;
        ctr[0] = (c >>> 24) & 0xff;
        ctr[1] = (c >>> 16) & 0xff;
        ctr[2] = (c >>> 8)  & 0xff;
        ctr[3] = (c >>> 0)  & 0xff;
        prf.reset();
        prf.update(salt);
        prf.update(ctr);
        prf.finish(u);
        for (let j:u32 = 0; j < len; j++) {
            t[j] = u[j];
        }
        for (let j:u32 = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (let k:u32 = 0; k < len; k++) {
                t[k] =u[k]^ u[k];
            }
        }
        for (let j:u32 = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
        }
    }
    for (let i:u32 = 0; i < len; i++) {
        t[i] = u[i] = 0;
    }
    for (let i = 0; i < 4; i++) {
        ctr[i] = 0;
    }
    prf.clean();
    return dk;
}
