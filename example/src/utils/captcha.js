//生成验证码
var svgCaptcha = require('svg-captcha'); //引入验证码依赖
var codeConfig = {
  size: 4, // 验证码长度
  ignoreChars: 'abcdefghijklmnopqrstuvwxyz0O1I', // Characters to exclude
  noise: 2, // 干扰线条的数量
  height: 40,
  width: 120,
  fontSize: 36,
  color: true,
  background: '#fff',
  url: '/captcha.png'
};
function captcha() {
  backgroundList = ['#CCEEFF', '#CCCCFF', '#D1BBFF', '#99FFFF', '#CCFF99'];
  codeConfig.background = backgroundList[Math.floor(Math.random() * backgroundList.length)];
  return svgCaptcha.create(codeConfig);
}
module.exports = {
  captcha
};
