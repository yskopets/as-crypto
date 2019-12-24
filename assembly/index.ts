import * as sha256 from '../lib/sha256'
import * as base64 from '../lib/base64'
import * as md5 from '../lib/md5'
import * as common from '../lib/common'

export function test():void{
  const a=new Uint8Array(5);
  const b=new Uint8Array(5);
  sha256.pbkdf2(a,b,5,5);
}

export function sha256_base64(str:string): string {
  return base64.encode(sha256.hash(common.utf82array(str)));
}

export function md5Str(str:string):string {
  return md5.hex32(common.utf82array(str));
}
