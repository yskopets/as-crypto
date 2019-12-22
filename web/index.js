import loader from '@assemblyscript/loader'

(async () => {
    const module = await loader.instantiate(fetch('build/untouched.wasm'), {
        env: {
            abort: () => {
            }
        }
    });

    let a = '';
    for (let i = 0; i < 1024000; i++) {
        a += 'd';
    }

    const str = module.__retain(module.__allocString(a));

    console.log(module.__getString(module.md5Str(str)));
})();
