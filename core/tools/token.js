const jwt = require('jsonwebtoken');

class Token {
  constructor(jwt_key) {
    this.jwt_key = jwt_key;
  }
  // 加密
  encrypt(data, time) {
    //data加密数据，time过期时间
    return jwt.sign(data, this.jwt_key, { expiresIn: time });
  }
  // 解密
  decrypt(token) {
    try {
      let data = jwt.verify(token, this.jwt_key);
      return {
        status: true,
        msg: '有效token',
        data
      };
    } catch (e) {
      return {
        status: false,
        msg: '无效token'
      };
    }
  }
}

module.exports = { Token };
