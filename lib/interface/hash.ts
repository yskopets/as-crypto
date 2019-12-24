export class Hash {
    public blockSize:i32;
    public digestLength:i32;
    public finished:boolean=false

    public update(data:Uint8Array,dataLength:u32=data.length):this{
        return this;
    };
    public finish(arr:Uint8Array):this{
        return this;
    };
    public digest():Uint8Array{
        return new Uint8Array(0);
    };
    public clean():void{};
    public saveState(arr:Uint8Array):void{};
    public restoreState(arr:Uint8Array,len:i32):void{};
}
