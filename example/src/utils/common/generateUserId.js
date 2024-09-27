const { customAlphabet } = require('nanoid');

function generateUserId() {
  // 创建一个生成8位数字的nanoID
  const nanoid = customAlphabet('1234567890', 8);
  return nanoid(); // 返回一个8位的纯数字用户ID
}

module.exports = { generateUserId };
