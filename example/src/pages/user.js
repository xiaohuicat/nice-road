const { User } = require('../model/User');

// 获取头像
async function getUserAvatar(req, res) {
  res.sendFile('C:\\Users\\***********\\avatar.jpg');
}

// 获取用户信息
async function getUserList(req, res) {
  try {
    const data = await User.findAll({
      attributes: ['id', 'user_id', 'name', 'gender', 'email']
    });
    res.send({ status: true, data });
  } catch (err) {
    res.send({ status: false, msg: err.message });
  }
}

module.exports = {
  getUserAvatar,
  getUserList
};
