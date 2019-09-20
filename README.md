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
```

## List of modules

- sha256
- base64
