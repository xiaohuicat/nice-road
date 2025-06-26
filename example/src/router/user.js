const { npath } = require('nice-road');
const user = require('../pages/user');

// 全局验证规则
const rules = null;
const urls = [
  npath('/getUserAvatar', user.getUserAvatar, ['GET']),
  npath('/getUserList', user.getUserList, ['no', 'POST', 'user']),
];

module.exports = {
  urls,
  rules,
};
