# as-crypto

[![](https://img.shields.io/npm/v/as-crypto.svg?style=flat-square)](https://www.npmjs.com/package/as-crypto)

用于assemblyscript的crypto库

## usage

安装as-crypto

```bash
$ npm install -S as-crypto
```

在文件中引入，以下是AssemblyScript默认创建的 assembly/index.ts

```ts
import * as sha256 from '../node_modules/as-crypto/lib/sha256'
import * as base64 from '../node_modules/as-crypto/lib/base64'
import * as md5 from '../node_modules/as-crypto/lib/md5'

//ascii文字转字节
function str2array(str:string):Uint8Array {
  let list=new Uint8Array(str.length);
  for(let i=0;i<str.length;i++){
    list[i]=str.charCodeAt(i)
  }
  return list;
}

//获取sha256后base64字符串
export function sha256_base64(str:string): string {
  return base64.encode(sha256.hash(str2array(str)));
}

//获取32位md5字符串
export function md532(str:string):string{
  return md5.hex32(str2array(str));
}
```

## List of modules

- sha256 修改自[fast-sha256-js](https://github.com/dchest/fast-sha256-js)
- base64 修改自[CSDN](https://blog.csdn.net/u011127019/article/details/51673230)
- md5 修改自[MD5](https://github.com/pod32g/MD5)
  
