const cryptoJS = require('crypto-js');

// 生成对称加密密钥
function aes_generate_key() {
  return cryptoJS.randomBytes(32); // 生成256位（32字节）密钥
}

// 对称加密
function aes_encrypt(message, key) {
  var keyBytes = cryptoJS.enc.Utf8.parse(key);
  var messageBytes = cryptoJS.enc.Utf8.parse(message);
  var decrypted = cryptoJS.AES.encrypt(messageBytes, keyBytes, {
    mode: cryptoJS.mode.ECB,
    padding: cryptoJS.pad.Pkcs7
  });
  return decrypted.toString();
}

// 对称解密
function aes_decrypt(message, key) {
  var keyBytes = cryptoJS.enc.Utf8.parse(key);
  var decrypted = cryptoJS.AES.decrypt(message, keyBytes, {
    mode: cryptoJS.mode.ECB,
    padding: cryptoJS.pad.Pkcs7
  });
  return cryptoJS.enc.Utf8.stringify(decrypted).toString();
}

module.exports = {
  aes_generate_key,
  aes_encrypt,
  aes_decrypt
};
