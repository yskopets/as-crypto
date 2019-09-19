import * as sha256 from '../lib/sha256'

function str2array(str:string):Uint8Array {
    let list=new Uint8Array(str.length);
    for(let i=0;i<str.length;i++){
        list[i]=str.charCodeAt(i)
    }
    return list;
}

console.log(sha256.hash(str2array('123')))
