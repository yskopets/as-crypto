import * as crypto from '../src'

function str2array(str:String){
    let list=[];
    for(let i=0;i<str.length;i++){
        list.push(str.charCodeAt(i));
    }
    return new Uint8Array(list)
}

let hash=crypto.hash(new Uint8Array(str2array('123456')))

console.log(hash);
