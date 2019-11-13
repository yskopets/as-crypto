const A: u32 = 0x67452301;
const B: u32 = 0xEFCDAB89;
const C: u32 = 0x98badcfe;
const D: u32 = 0x10325476;

function F(x: u32, y: u32, z: u32): u32 {
    return (x & y) | ((~x) & z);
}

function G(x: u32, y: u32, z: u32): u32 {
    return (x & z) | (y & (~z));
}

function H(x: u32, y: u32, z: u32): u32 {
    return x ^ y ^ z;
}

function I(x: u32, y: u32, z: u32): u32 {
    return y ^ (x | (~z));
}

function FF(a: u32, b: u32, c: u32, d: u32, src: u32, s: u32, m: u32): u32 {
    return b + LeftMoveLoop(a + F(b, c, d) + src + m, s);
}

function GG(a: u32, b: u32, c: u32, d: u32, src: u32, s: u32, m: u32): u32 {
    return b + LeftMoveLoop(a + G(b, c, d) + src + m, s);
}

function HH(a: u32, b: u32, c: u32, d: u32, src: u32, s: u32, m: u32): u32 {
    return b + LeftMoveLoop(a + H(b, c, d) + src + m, s);
}

function II(a: u32, b: u32, c: u32, d: u32, src: u32, s: u32, m: u32): u32 {
    return b + LeftMoveLoop(a + I(b, c, d) + src + m, s);
}


function LeftMoveLoop(n: u32, s: u32): u32 {
    return (n << s) | (n >> (32 - s));
}
//高仿memcpy
function memcpy(dest: Uint8Array, offset: i32, src: Uint8Array, size: i32): void {
    for (let i = 0; i < size; i++) {
        dest[i + offset] = src[i];
    }
}
//高仿memset
function memset(dest: Uint8Array, offset: i32, ch: u8, size: i32): void {
    for (let i = 0; i < size; i++) {
        dest[i + offset] = ch;
    }
}

function longTouchar(n: i64): Uint8Array {
    const b = new Uint8Array(4);
    for (let i = 3; i >= 0; --i) {
        b[i] = <u8>(n >> i * 8);
    }
    return b;
}


export class Md5 {
    private buf: Uint8Array;
    private virtualVals: Uint32Array = new Uint32Array(4);

    spTouintArray(): Uint32Array {
        const a = new Uint32Array(16);
        for (let i = 0; i < 16; ++i) {
            let a1: u32 = this.buf[i * 4];
            let a2: u32 = this.buf[i * 4 + 1];
            let a3: u32 = this.buf[i * 4 + 2];
            let a4: u32 = this.buf[i * 4 + 3];
            a[i] = a1 | a2 << 8 | a3 << 16 | a4 << 24;
        }
        return a;
    }

    process(): void {
        let a = this.virtualVals[0], b = this.virtualVals[1], c = this.virtualVals[2], d = this.virtualVals[3];
        let M = this.spTouintArray();

        a = FF(a, b, c, d, M[0], 7, 0xd76aa478);
        d = FF(d, a, b, c, M[1], 12, 0xe8c7b756);
        c = FF(c, d, a, b, M[2], 17, 0x242070db);
        b = FF(b, c, d, a, M[3], 22, 0xc1bdceee);
        a = FF(a, b, c, d, M[4], 7, 0xf57c0faf);
        d = FF(d, a, b, c, M[5], 12, 0x4787c62a);
        c = FF(c, d, a, b, M[6], 17, 0xa8304613);
        b = FF(b, c, d, a, M[7], 22, 0xfd469501);
        a = FF(a, b, c, d, M[8], 7, 0x698098d8);
        d = FF(d, a, b, c, M[9], 12, 0x8b44f7af);
        c = FF(c, d, a, b, M[10], 17, 0xffff5bb1);
        b = FF(b, c, d, a, M[11], 22, 0x895cd7be);
        a = FF(a, b, c, d, M[12], 7, 0x6b901122);
        d = FF(d, a, b, c, M[13], 12, 0xfd987193);
        c = FF(c, d, a, b, M[14], 17, 0xa679438e);
        b = FF(b, c, d, a, M[15], 22, 0x49b40821);

        a = GG(a, b, c, d, M[1], 5, 0xf61e2562);
        d = GG(d, a, b, c, M[6], 9, 0xc040b340);
        c = GG(c, d, a, b, M[11], 14, 0x265e5a51);
        b = GG(b, c, d, a, M[0], 20, 0xe9b6c7aa);
        a = GG(a, b, c, d, M[5], 5, 0xd62f105d);
        d = GG(d, a, b, c, M[10], 9, 0x2441453);
        c = GG(c, d, a, b, M[15], 14, 0xd8a1e681);
        b = GG(b, c, d, a, M[4], 20, 0xe7d3fbc8);
        a = GG(a, b, c, d, M[9], 5, 0x21e1cde6);
        d = GG(d, a, b, c, M[14], 9, 0xc33707d6);
        c = GG(c, d, a, b, M[3], 14, 0xf4d50d87);
        b = GG(b, c, d, a, M[8], 20, 0x455a14ed);
        a = GG(a, b, c, d, M[13], 5, 0xa9e3e905);
        d = GG(d, a, b, c, M[2], 9, 0xfcefa3f8);
        c = GG(c, d, a, b, M[7], 14, 0x676f02d9);
        b = GG(b, c, d, a, M[12], 20, 0x8d2a4c8a);

        a = HH(a, b, c, d, M[5], 4, 0xfffa3942);
        d = HH(d, a, b, c, M[8], 11, 0x8771f681);
        c = HH(c, d, a, b, M[11], 16, 0x6d9d6122);
        b = HH(b, c, d, a, M[14], 23, 0xfde5380c);
        a = HH(a, b, c, d, M[1], 4, 0xa4beea44);
        d = HH(d, a, b, c, M[4], 11, 0x4bdecfa9);
        c = HH(c, d, a, b, M[7], 16, 0xf6bb4b60);
        b = HH(b, c, d, a, M[10], 23, 0xbebfbc70);
        a = HH(a, b, c, d, M[13], 4, 0x289b7ec6);
        d = HH(d, a, b, c, M[0], 11, 0xeaa127fa);
        c = HH(c, d, a, b, M[3], 16, 0xd4ef3085);
        b = HH(b, c, d, a, M[6], 23, 0x4881d05);
        a = HH(a, b, c, d, M[9], 4, 0xd9d4d039);
        d = HH(d, a, b, c, M[12], 11, 0xe6db99e5);
        c = HH(c, d, a, b, M[15], 16, 0x1fa27cf8);
        b = HH(b, c, d, a, M[2], 23, 0xc4ac5665);

        a = II(a, b, c, d, M[0], 6, 0xf4292244);
        d = II(d, a, b, c, M[7], 10, 0x432aff97);
        c = II(c, d, a, b, M[14], 15, 0xab9423a7);
        b = II(b, c, d, a, M[5], 21, 0xfc93a039);
        a = II(a, b, c, d, M[12], 6, 0x655b59c3);
        d = II(d, a, b, c, M[3], 10, 0x8f0ccc92);
        c = II(c, d, a, b, M[10], 15, 0xffeff47d);
        b = II(b, c, d, a, M[1], 21, 0x85845dd1);
        a = II(a, b, c, d, M[8], 6, 0x6fa87e4f);
        d = II(d, a, b, c, M[15], 10, 0xfe2ce6e0);
        c = II(c, d, a, b, M[6], 15, 0xa3014314);
        b = II(b, c, d, a, M[13], 21, 0x4e0811a1);
        a = II(a, b, c, d, M[4], 6, 0xf7537e82);
        d = II(d, a, b, c, M[11], 10, 0xbd3af235);
        c = II(c, d, a, b, M[2], 15, 0x2ad7d2bb);
        b = II(b, c, d, a, M[9], 21, 0xeb86d391);

        this.virtualVals[0] = a + this.virtualVals[0];
        this.virtualVals[1] = b + this.virtualVals[1];
        this.virtualVals[2] = c + this.virtualVals[2];
        this.virtualVals[3] = d + this.virtualVals[3];
    }

    constructor(data: Uint8Array) {
        let size = data.length;
        this.virtualVals[0] = A;
        this.virtualVals[1] = B;
        this.virtualVals[2] = C;
        this.virtualVals[3] = D;

        let oriSize = size;
        let counter = 0;
        let needAddEnd = true;
        while (true) {
            this.buf = new Uint8Array(64);//在process后自动释放
            let cpyLen = size - counter;
            if (cpyLen > 64) {
                cpyLen = 64;
            }
            if (cpyLen >= 56)//只要大于等于56，就意味着无法同时写下8+64位，结束的情况一定是写下oriSize
            {
                memcpy(this.buf, 0, data.slice(counter, data.length), cpyLen);//先行拷贝
                size -= cpyLen;
                counter += cpyLen;
                if (cpyLen == 64) {
                    this.process();
                    continue;
                }
                this.buf[cpyLen] = 128;//0x10000000
                memset(this.buf, cpyLen + 1, 0, 64 - cpyLen - 1);//剩余全部填充0
                needAddEnd = false;
                this.process();
            } else {
                if (needAddEnd) {
                    memcpy(this.buf, 0, data.slice(counter, data.length), size);//拷贝剩余字节

                    this.buf[size] = 128;//0x10000000
                    memset(this.buf, size + 1, 0, 64 - size - 1);//剩余全部填充0
                } else {
                    memset(this.buf, 0, 0, 64);//在前一项已经填充过0，证明一定填充过0x10000000，所以这就只用填充0
                }
                const ucSize = longTouchar(oriSize * 8);

                //将int复制到buf上最后8个字节上去
                memcpy(this.buf, 56, ucSize, 4);

                //delete ucSize;
                this.process();
                break;
            }
        }
    }

    getResult(): Uint8Array {
        const ret = new Uint8Array(16);
        for (let i = 0; i < 4; ++i) {
            memcpy(ret, i * 4, longTouchar(this.virtualVals[i]), 4);
        }
        return ret;
    }

}

const hexCharList: string[] = '0123456789abcdef'.split('');

//计算32位md5
function getHexStr(arr: Uint8Array): string {
    let s = '';
    for (let i = 0; i < arr.length; ++i) {
        s = s + hexCharList[arr[i] / 16] + hexCharList[arr[i] % 16]
    }
    return s;
}

//直接获取字节
export function hash(data: Uint8Array): Uint8Array {
    return (new Md5(data)).getResult();
}

//获取32位
export function hex32(data: Uint8Array): string {
    return getHexStr((new Md5(data)).getResult());
}

//获取16位
export function hex16(data: Uint8Array): string {
    return hex32(data).substring(8, 24);
}
