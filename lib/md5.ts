//高仿memcpy
function memcpy(dest: Uint8Array, offset: i32, src: Uint8Array, size: i32): void {
    for (let i = 0; i < size; i++) {
        dest[i + offset] = src[i];
    }
}

const k:u32[] = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee ,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501 ,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be ,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821 ,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa ,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8 ,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed ,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a ,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c ,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70 ,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05 ,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665 ,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039 ,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1 ,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1 ,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 ];

// r specifies the per-round shift amounts
const r:u32[] = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

// leftrotate function definition
function leftRoute(x:i64, c:i64):i64 {
    return (((x) << (c)) | ((x) >> (32 - (c))))
}

function toBytes(val:u32,bytes:Uint8Array,offset:u32):void
{
    bytes[0+offset] = <u8> val;
    bytes[1+offset] = <u8> (val >> 8);
    bytes[2+offset] = <u8> (val >> 16);
    bytes[3+offset] = <u8> (val >> 24);
}

function toInt32(bytes:Uint8Array,offset:u32):u32
{
    return <u32>bytes[0+offset]
        | (<u32> bytes[1+offset] << 8)
        | (<u32> bytes[2+offset] << 16)
        | (<u32> bytes[3+offset] << 24);
}

function md5(raw:Uint8Array):Uint8Array{

    // These vars will contain the hash
    let h0:u32, h1:u32, h2:u32, h3:u32;
    let length=raw.length;

    // Message (to prepare)
    let msg:Uint8Array;

    let newLength:u32;
    let offset:u32;
    let w=new Uint32Array(16);
    let a:u32;
    let b:u32;
    let c:u32;
    let d:u32;
    let i:u32;
    let f:u32;
    let g:u32;
    let temp:u32;

    h0 = 0x67452301;
    h1 = 0xefcdab89;
    h2 = 0x98badcfe;
    h3 = 0x10325476;

    for (newLength = length + 1; newLength % (512/8) != 448/8; newLength++);

    msg=new Uint8Array(newLength+8)
    memcpy(msg, 0,raw, length);
    msg[length] = 0x80;
    for (offset = length + 1; offset < newLength; offset++)
        msg[offset] = 0; // append "0" bits

    toBytes(length*8, msg , newLength);

    toBytes(length>>29, msg , newLength + 4);

    for(offset=0; offset<newLength; offset += (512/8)) {

        for (i = 0; i < 16; i++){
            w[i] = toInt32(msg , offset + i*4);
        }
        a = h0;
        b = h1;
        c = h2;
        d = h3;

        for(i = 0; i<64; i++) {
            if (i < 16) {
                f = (b & c) | ((~b) & d);
                g = i;
            } else if (i < 32) {
                f = (d & b) | ((~d) & c);
                g = (5*i + 1) % 16;
            } else if (i < 48) {
                f = b ^ c ^ d;
                g = (3*i + 5) % 16;
            } else {
                f = c ^ (b | (~d));
                g = (7*i) % 16;
            }
            temp = d;
            d = c;
            c = b;
            b = b + <i32>leftRoute((a + f + k[i] + w[g]), r[i]);
            a = temp;
        }
        h0 += a;
        h1 += b;
        h2 += c;
        h3 += d;
    }
    let result=new Uint8Array(16);
    toBytes(h0, result,0);
    toBytes(h1, result , 4);
    toBytes(h2, result , 8);
    toBytes(h3, result , 12);
    return result
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
    return md5(data);
}

//获取32位
export function hex32(data: Uint8Array): string {
    return getHexStr(md5(data));
}

//获取16位
export function hex16(data: Uint8Array): string {
    return hex32(data).substring(8, 24);
}
