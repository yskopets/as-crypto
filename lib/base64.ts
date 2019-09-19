const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export function encode(input:Uint8Array):string {
    var output = '';
    var chr1:i32, chr2:i32, chr3:i32, enc1:i32, enc2:i32, enc3:i32, enc4:i32;
    var i:i32 = 0;
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
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
}
