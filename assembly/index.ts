import * as sha256 from '../lib/sha256'
import * as base64 from '../lib/base64'

function str2array(str:string):Uint8Array {
  let list=new Uint8Array(str.length);
  for(let i=0;i<str.length;i++){
    list[i]=str.charCodeAt(i)
  }
  return list;
}

export function sha256_base64(str:string): string {
  return base64.encode(sha256.hash(str2array(str)));
}
