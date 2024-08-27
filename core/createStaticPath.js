const path = require('path');

/**
 * 创建静态文件路径
 * @param {String} static_url
 */
function createStaticPath(static_url) {
  //配置jsonDB路径
  const db_url = path.join(static_url, 'databases');

  //配置user路径
  const user_url = path.join(static_url, 'users');

  //配置templates路径
  const templates_url = path.join(static_url, 'templates');

  //配置公共路径
  const public_url = path.join(static_url, 'public');

  //配置文章静态页面路径
  const pages_url = path.join(static_url, 'pages');

  //非对称加密私钥
  const private_pem_path = path.join(static_url, '/RSA/private_pem.txt');

  //非对称加密公钥
  const public_pem_path = path.join(static_url, '/RSA/public_pem.txt');

  return {
    static_url,
    db_url,
    user_url,
    templates_url,
    public_url,
    pages_url,
    private_pem_path,
    public_pem_path,
  };
}

module.exports = {
  createStaticPath,
}