export const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
export const BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";

export function encode(input:Uint8Array, alphabet: string = BASE64):string {
    let output = '';
    let chr1:i32, chr2:i32, chr3:i32, enc1:i32, enc2:i32, enc3:i32, enc4:i32;
    let i:i32 = 0;
    while (i < input.length) {
        chr1 = input[i++];

        chr2 = i<input.length?input[i]:0;
        i++;
        chr3 = i<input.length?input[i]:0;
        i++;

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = chr2||chr3?((chr2 & 15) << 2) | (chr3 >> 6):64;
        enc4 = chr3?chr3 & 63:64;

        output = output +
            alphabet.charAt(enc1) + alphabet.charAt(enc2) +
            alphabet.charAt(enc3) + alphabet.charAt(enc4);
    }
    return output;
}

export function decode(input:string, alphabet: string = BASE64):Uint8Array {
    //非法字符串
    if(input.length==0||input.length%4!=0)
        return new Uint8Array(0);

    let output=new Uint8Array(input.length);
    let i = 0;
    let length=0;
    while(i<input.length){
        const enc=new Uint8Array(4);
        for(let j=0;j<4;j++){
            const c=input.charAt(i++);
            let index=alphabet.indexOf(c);
            if(index<0)
                return new Uint8Array(0);
            if(index==64){
                return output.slice(0,length);
            }
            enc[j]=index;
            if(j==1){
                output[length++]=(enc[0] << 2) | (enc[1] >> 4)
            }else if(j==2){
                output[length++]=((enc[1] & 15) << 4) | (enc[2] >> 2)
            }else if(j==3){
                output[length++]=((enc[2] & 3) << 6) | enc[3]
            }
        }
    }
    return output.slice(0,length);
}
