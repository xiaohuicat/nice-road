const crypto = require('crypto');

// 生成 RSA 密钥对
function rsa_generate_keys() {
  const { generateKeyPairSync } = crypto;
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // 模数长度（位数）
    publicKeyEncoding: {
      type: 'pkcs1', // 公钥编码格式
      format: 'pem' // 公钥输出格式
    },
    privateKeyEncoding: {
      type: 'pkcs1', // 私钥编码格式
      format: 'pem' // 私钥输出格式
    }
  });
  return { privateKey, publicKey };
}

// 使用公钥加密数据
function rsa_encrypt(publicKey, data) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(data)
  );

  return encryptedData.toString('base64');
}

// 使用私钥解密数据
function rsa_decrypt(privateKey, encryptedData) {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(encryptedData, 'base64') // Ensure encryptedData is a Buffer
  );
  return decryptedData.toString('utf-8');
}

module.exports = {
  rsa_generate_keys,
  rsa_decrypt,
  rsa_encrypt
};
