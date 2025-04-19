const cryptoJS = require("crypto-js");
const crypto = require('crypto'); // 添加Node.js内置crypto模块
const { Buffer } = require('buffer'); // 添加Buffer模块

// 生成对称加密密钥
function aes_generate_key() {
  // 生成256位随机密钥
  const randomBytes = crypto.randomBytes(32);
  // 返回Base64编码的密钥，与Swift端兼容
  return randomBytes.toString('base64');
}

// 对称加密 - 与Swift版本兼容 (AES-GCM)
function aes_encrypt(message, key) {
  try {
    // 解码Base64密钥
    const keyBuffer = Buffer.from(key, 'base64');
    // 生成随机12字节IV
    const iv = crypto.randomBytes(12);
    
    // 创建加密器
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
    
    // 加密数据
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // 获取认证标签
    const authTag = cipher.getAuthTag();
    
    // 将IV和认证标签与密文一起编码为Base64
    const combined = Buffer.concat([
      iv,
      Buffer.from(encrypted, 'base64'),
      authTag
    ]);
    
    return combined.toString('base64');
  } catch (error) {
    console.error("加密错误:", error);
    return null;
  }
}

// 对称解密 - 与Swift版本兼容 (AES-GCM)
function aes_decrypt(encryptedMessage, key) {
  try {
    // 尝试使用新的AES-GCM格式解密
    try {
      // 解码Base64密钥和密文
      const keyBuffer = Buffer.from(key, 'base64');
      const combined = Buffer.from(encryptedMessage, 'base64');
      
      // 提取IV (前12字节)
      const iv = combined.slice(0, 12);
      
      // 提取认证标签 (最后16字节)
      const authTag = combined.slice(combined.length - 16);
      
      // 提取密文 (中间部分)
      const ciphertext = combined.slice(12, combined.length - 16);
      
      // 创建解密器
      const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
      decipher.setAuthTag(authTag);
      
      // 解密数据
      let decrypted = decipher.update(ciphertext, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (gcmError) {
      console.warn("GCM解密失败，尝试旧版ECB模式:", gcmError.message);
      
      // 如果GCM解密失败，尝试使用旧版ECB模式
      var keyBytes = cryptoJS.enc.Utf8.parse(key);
      var decrypted = cryptoJS.AES.decrypt(
        {ciphertext: cryptoJS.enc.Utf8.parse(encryptedMessage)},
        keyBytes,
        {
          mode: cryptoJS.mode.ECB,
          padding: cryptoJS.pad.Pkcs7,
        }
      );
      
      return decrypted.toString(cryptoJS.enc.Utf8);
    }
  } catch (error) {
    console.error("解密错误:", error);
    return null;
  }
}

module.exports = {
  aes_generate_key,
  aes_encrypt,
  aes_decrypt,
};