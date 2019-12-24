import loader from '@assemblyscript/loader'

(async () => {
    const module = await loader.instantiate(fetch('build/untouched.wasm'), {
        env: {
            abort: () => {
            }
        }
    });

    let a = '';
    a='你好我是123456，abdcdf**&%$^*)/*-+';
    const str = module.__retain(module.__allocString(a));

    console.log(module.__getString(module.md5Str(str)));
    console.log(a)
})();
