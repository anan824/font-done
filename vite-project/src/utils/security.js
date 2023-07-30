const keyArr = ['set', 'P', 'ub', 'lic', 'Key'].join('');
import CryptoJS from 'crypto-js'
// Security module
export default {
  // Symmetric encryption
  symmetricEncrypt(text, keyText) {
    const key = CryptoJS.enc.Utf8.parse(keyText);
    const iv = CryptoJS.enc.Utf8.parse(this.getIvFromKey(keyText));
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },

  // Symmetric decryption
  symmetricDecrypt(text, keyText) {
    const key = CryptoJS.enc.Utf8.parse(keyText);
    const iv = CryptoJS.enc.Utf8.parse(this.getIvFromKey(keyText));
    const decrypted = CryptoJS.AES.decrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },

  // Asymmetric encryption
  asymmetryEncrypt(text, publicKey) {
    // 100Characters sharding
    if (text.length > 100) {
      const arr = [];
      let times = Math.ceil(text.length / 100);
      for (let i = 0; i < times; i++) {
        let subStr = text.slice(i * 100, (i + 1) * 100);
        arr.push(this.asymmetryEncrypt(subStr, publicKey));
      }
      return arr.join(',');
    } else {
      const encrypt = new JSEncrypt();
      encrypt[keyArr](publicKey);
      return encrypt.encrypt(text);
    }
  },

  // sha1
  sha1(text) {
    return CryptoJS.SHA1(text).toString();
  },

  // According to availableiv
  getIvFromKey(key) {
    return key.split('').reverse().join('');
  },

  // encryptionjsonReturn encrypted data
  encryptJson(data, type = 1, keyText = '') {
  
    if (type == 1 || type == 2) {
      const keys = Object.keys(data)
        .sort()
        .map((key) => {
          return `${key}=${data[key]}`;
        });
      const str = JSON.stringify(data);
      return {
        cipher_txt:
          type == 1
            ? this.asymmetryEncrypt(str, keyText)
            : this.symmetricEncrypt(str, keyText),
        digest: this.sha1(keys.join('&')),
        encrypt_version: '2.0',
      };
    }
    return data;
  },
  // Public key obfuscation decryption
  decodePuliceKey(key) {
    var ary = key.split('');
    for (var index = 0; index < ary.length / 2; index++) {
      if (index % 2 && index % 5) {
        var left = ary[ary.length - 1 - index];
        ary[ary.length - 1 - index] = ary[index];
        ary[index] = left;
      }
    }
    return ary.join('');
  },
};
