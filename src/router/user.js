const { npath } = require('../../core');
const users = require('../pages/users');

// 全局验证规则
const rules = null;
const urls = [
  npath('/getUserAvatar', users.getUserAvatar, ['GET']),
  npath('/getUserList', users.getUserList, ['no', 'POST', 'user'])
];

module.exports = {
  urls,
  rules
};
