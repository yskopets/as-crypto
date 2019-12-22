const fs = require("fs");
const loader = require('@assemblyscript/loader')
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/untouched.wasm"));
const imports = {
    env: {
        abort(_msg, _file, line, column) {
            console.error("abort called at index.ts:" + line + ":" + column);
        }
    }
};

(async function () {

    const module = await loader.instantiate(compiled, imports);
    let a = '';
    for (let i = 0; i < 255; i++) {
        a += 'd';
    }
//a='123456';
    const str = module.__retain(module.__allocString(a));

    console.log(module.__getString(module.md5Str(str)));
    console.log(a)
})();
