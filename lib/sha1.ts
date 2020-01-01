import {Hash} from "./base/hash";

const SHIFT:u8[] = [24, 16, 8, 0];
const EXTRA:i32[] = [-2147483648, 8388608, 32768, 128];

class Sha1 extends Hash{

    private blocks:Uint8Array;
    private h:u32[];
    private block:u8;
    private start:u32;
    private bytes:i64;
    private hBytes:i64;
    private finalized:boolean;
    private hashed:boolean;
    private first:boolean;
    private lastByteIndex:u32;

    constructor() {
        super();
        this.blockSize=64;
        this.digestLength=20;
        this.reset();
    }

    private reset():void{
        this.blocks=new Uint8Array(17);
        this.h=[
            0x67452301,
            0xEFCDAB89,
            0x98BADCFE,
            0x10325476,
            0xC3D2E1F0
        ];
        this.block =0;
        this.start=0;
        this.bytes=0;
        this.hBytes=0;
        this.finalized = false;
        this.hashed =false;
        this.first = true;
    }

    update(message: Uint8Array, length: u32 = message.length): this {
        if (this.finalized) {
            return this;
        }
        let index:u32 = 0;
        let i:u32;
        //let blocks=this.blocks;

        while (index < length) {
            if (this.hashed) {
                this.hashed = false;

                this.blocks=new Uint8Array(17);
                this.blocks[0] = this.block;
            }

            for (i = this.start; index < length && i < 64; ++index) {
                this.blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }

            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
                this.block = this.blocks[16];
                this.start = i - 64;
                this.hash();
                this.hashed = true;
            } else {
                this.start = i;
            }
        }
        if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
        }
        return this;
    }

    finish(arr: Uint8Array): this {
        if (!this.finalized) {
            this.finalized = true;
            let  i = this.lastByteIndex;
            this.blocks[16] = this.block;
            let index=i>>2;
            this.blocks[index] = <u8>(this.blocks[index]| EXTRA[<u8>(i & 3)]);
            this.block = this.blocks[16];
            if (i >= 56) {
                if (!this.hashed) {
                    this.hash();
                }
                this.blocks=new Uint8Array(17);
                this.blocks[0] = this.block;
                this.blocks[0] = this.block;
            }
            this.blocks[14] = <u8>(this.hBytes << 3 | this.bytes >>> 29);
            this.blocks[15] = <u8>(this.bytes << 3);
            this.hash();
        }
        //输出信息
        for(let i=0;i<5;i++){
            arr[i*5]=this.h[i]>>>26&0xff;
            arr[i*5+1]=this.h[i]>>>16&0xff;
            arr[i*5+2]=this.h[i]>>>8&0xff;
            arr[i*5+3]=this.h[i]&0xff;
        }
        return this;
    }

    digest(): Uint8Array {
        const out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    }

    hash():void{
        let a = this.h[0], b = this.h[1], c = this.h[2], d = this.h[3], e = this.h[4];
        let f:u32, j:u32, t:u32, blocks = this.blocks;

        for(j = 16; j < 80; ++j) {
            t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
            blocks[j] =  (t << 1) | (t >>> 31);
        }

        for(j = 0; j < 20; j += 5) {
            f = (b & c) | ((~b) & d);
            t = (a << 5) | (a >>> 27);
            e = t + f + e + 1518500249 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = (a & b) | ((~a) & c);
            t = (e << 5) | (e >>> 27);
            d = t + f + d + 1518500249 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = (e & a) | ((~e) & b);
            t = (d << 5) | (d >>> 27);
            c = t + f + c + 1518500249 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = (d & e) | ((~d) & a);
            t = (c << 5) | (c >>> 27);
            b = t + f + b + 1518500249 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = (c & d) | ((~c) & e);
            t = (b << 5) | (b >>> 27);
            a = t + f + a + 1518500249 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for(; j < 40; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = t + f + e + 1859775393 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = t + f + d + 1859775393 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = t + f + c + 1859775393 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = t + f + b + 1859775393 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = t + f + a + 1859775393 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for(; j < 60; j += 5) {
            f = (b & c) | (b & d) | (c & d);
            t = (a << 5) | (a >>> 27);
            e = t + f + e - 1894007588 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = (a & b) | (a & c) | (b & c);
            t = (e << 5) | (e >>> 27);
            d = t + f + d - 1894007588 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = (e & a) | (e & b) | (a & b);
            t = (d << 5) | (d >>> 27);
            c = t + f + c - 1894007588 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = (d & e) | (d & a) | (e & a);
            t = (c << 5) | (c >>> 27);
            b = t + f + b - 1894007588 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = (c & d) | (c & e) | (d & e);
            t = (b << 5) | (b >>> 27);
            a = t + f + a - 1894007588 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        for(; j < 80; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = t + f + e - 899497514 + blocks[j] << 0;
            b = (b << 30) | (b >>> 2);

            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = t + f + d - 899497514 + blocks[j + 1] << 0;
            a = (a << 30) | (a >>> 2);

            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = t + f + c - 899497514 + blocks[j + 2] << 0;
            e = (e << 30) | (e >>> 2);

            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = t + f + b - 899497514 + blocks[j + 3] << 0;
            d = (d << 30) | (d >>> 2);

            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = t + f + a - 899497514 + blocks[j + 4] << 0;
            c = (c << 30) | (c >>> 2);
        }

        this.h[0] = this.h[0] + a << 0;
        this.h[1] = this.h[1] + b << 0;
        this.h[2] = this.h[2] + c << 0;
        this.h[3] = this.h[3] + d << 0;
        this.h[4] = this.h[4] + e << 0;
    }
}

export function hash(data: Uint8Array): Uint8Array {
    const h = (new Sha1()).update(data);
    const digest = h.digest();
    // h.clean();
    return digest;
}
