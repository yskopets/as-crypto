// HMAC implements HMAC-SHA256 message authentication algorithm.

import {Hash} from "./interface/hash";

export class HMAC<T extends Hash> {
    private inner: T ;
    private outer: T ;

    blockSize: i32;
    digestLength: i32;

    // Copies of hash states after keying.
    // Need for quick reset without hashing they key again.
    private istate: Uint32Array;
    private ostate: Uint32Array;

    constructor(type:()=>T,key: Uint8Array) {
        //初始化
        this.inner=type();
        this.outer=type();
        this.blockSize=this.inner.blockSize;
        this.digestLength=this.inner.digestLength;


        const pad = new Uint8Array(this.blockSize);
        if (key.length > this.blockSize) {
            (type()).update(key).finish(pad).clean();
        } else {
            for (let i = 0; i < key.length; i++) {
                pad[i] = key[i];
            }
        }
        for (let i = 0; i < pad.length; i++) {
            pad[i] =pad[i]^0x36;
        }
        this.inner.update(pad);

        for (let i = 0; i < pad.length; i++) {
            pad[i]=pad[i]^0x36 ^ 0x5c
        }
        this.outer.update(pad);

        this.istate = new Uint32Array(8);
        this.ostate = new Uint32Array(8);

        this.inner.saveState(this.istate);
        this.outer.saveState(this.ostate);

        for (let i = 0; i < pad.length; i++) {
            pad[i] = 0;
        }
    }

    // Returns HMAC state to the state initialized with key
    // to make it possible to run HMAC over the other data with the same
    // key without creating a new instance.
    reset(): this {
        this.inner.restoreState(this.istate, this.inner.blockSize);
        this.outer.restoreState(this.ostate, this.outer.blockSize);
        return this;
    }

    // Cleans HMAC state.
    clean():void {
        for (let i = 0; i < this.istate.length; i++) {
            this.ostate[i] = this.istate[i] = 0;
        }
        this.inner.clean();
        this.outer.clean();
    }

    // Updates state with provided data.
    update(data: Uint8Array): this {
        this.inner.update(data);
        return this;
    }

    // Finalizes HMAC and puts the result in out.
    finish(out: Uint8Array): this {
        if (this.outer.finished) {
            this.outer.finish(out);
        } else {
            this.inner.finish(out);
            this.outer.update(out, this.digestLength).finish(out);
        }
        return this;
    }

    // Returns message authentication code.
    digest(): Uint8Array {
        const out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    }
}
