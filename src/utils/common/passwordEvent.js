const bcrypt = require('bcrypt');

// 生成密码
function generatePassword(plainPassword) {
  // 生成盐值
  const saltRounds = 3; //设置哈希次数为10
  const salt = bcrypt.genSaltSync(saltRounds);
  // 加密密码
  const hash = bcrypt.hashSync(plainPassword, salt); //对明文密码进行哈希加密
  return { salt, hash };
}

// 验证秘密
function verifyPassword(plainPassword, hash) {
  const isMatch = bcrypt.compareSync(plainPassword, hash);
  return isMatch;
}

module.exports = {
  generatePassword,
  verifyPassword
};
