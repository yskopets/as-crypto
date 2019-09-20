const fs = require("fs");
const loader=require('assemblyscript/lib/loader')
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/untouched.wasm"));
const imports = {
  env: {
    abort(_msg, _file, line, column) {
       console.error("abort called at index.ts:" + line + ":" + column);
    }
  }
};
Object.defineProperty(module, "exports", {
  get: () => new WebAssembly.Instance(compiled, imports).exports
});

(async function(){

  const module=await loader.instantiate(compiled,imports);

  const str=module.__retain(module.__allocString('test_string'));

  console.log(module.__getString(module.sha256_base64(str)));
})();
