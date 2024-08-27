const { aes_decrypt } = require('./crypt/aes_crypt');
const { rsa_decrypt } = require('./crypt/rsa_crypt');

/**
 * 双重解密
 * @param {String} aes_data         对称加密的数据
 * @param {String} rsa_aes_key      非对称加密的对称加密的密钥
 * @param {String} rsa_private_pem  非对称解密的私钥
 * @returns
 */
function db_decrypt(aes_data, rsa_aes_key, rsa_private_pem) {
  const aes_key = rsa_decrypt(rsa_private_pem, rsa_aes_key); // 获取对称加密的密钥
  const data = aes_decrypt(aes_data, aes_key); // 获取对称加密内容
  return data;
}

function try_decrypt_payload(body, rsa_aes_key, rsa_private_pem) {
  try_decrypt(body, 'payload', rsa_aes_key, rsa_private_pem);
}

function try_decrypt(obj, attr, rsa_aes_key, rsa_private_pem) {
  try {
    obj[attr] = JSON.parse(db_decrypt(obj[attr], rsa_aes_key, rsa_private_pem));
  } catch (err) {
    obj[attr] = {};
  }
}

module.exports = {
  db_decrypt,
  try_decrypt_payload,
  try_decrypt
};
