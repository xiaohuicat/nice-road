const nodemailer = require('nodemailer');

/**
 * 发送邮件
 * @param {Object} options
 * @param {String} options.to 收件人
 * @param {String} options.subject 邮件主题
 * @param {String} options.text 邮件正文
 * @param {String} options.html 邮件html
 * @returns
 */
function sendEmail({ to, subject, text, html }) {
  return new Promise((resolve, reject) => {
    // 创建发送邮件的传输器
    let transporter = nodemailer.createTransport({
      service: 'qq', // 使用Gmail服务
      auth: {
        user: '**********@qq.com', // 发件人的电子邮件地址
        pass: '******' // 发件人的电子邮件密码或应用程序令牌
      }
    });
    // 邮件选项
    let mailOptions = {
      from: '**********@qq.com', // 发件人的电子邮件地址
      to, // 收件人的电子邮件地址
      subject, // 邮件主题
      text, // 邮件正文
      html //邮件html
    };

    // 发送邮件
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = {
  sendEmail
};
