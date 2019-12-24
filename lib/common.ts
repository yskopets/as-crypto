/**
 * ascii字符串转字节数组
 */
export function ascii2array(str:string):Uint8Array{
    const arr=new Uint8Array(str.length);
    for(let i=0;i<str.length;i++){
        arr[i]=str.charCodeAt(i)
    }
    return arr;
}

/**
 * 字节数组转ascii字符串
 */
export function array2ascii(arr:Uint8Array):string{
    let str='';
    for(let i=0;i<arr.length;i++){
        str+=String.fromCharCode(arr[i]);
    }
    return str;
}

/**
 * utf8字符串转字节数组
 */
export function utf82array(str:string):Uint8Array{
    const buffer=String.UTF8.encode(str,false);
    return Uint8Array.wrap(buffer);
}

/**
 * 数组转utf8字符串
 */
export function array2utf8(arr:Uint8Array):string {
    return String.UTF8.decode(arr.buffer,false);
}
