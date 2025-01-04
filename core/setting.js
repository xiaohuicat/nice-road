const path = require('path');
const fs = require('fs');
const { isObject } = require('./utils');

// 配置文件对象
const SETTING = {};

/**
 * 获取配置
 * @return {Object} 配置对象
 */
function getSetting() {
  return SETTING;
}

/**
 * 创建静态文件路径
 * @param {String} staticPath 静态文件路径
 * @return {Object} 静态文件路径对象
 */
function createStaticPath(staticPath) {
  const DB_URL = path.join(staticPath, 'databases');
  const USER_URL = path.join(staticPath, 'users');
  const TEMPLATES_URL = path.join(staticPath, 'templates');
  const PUBLIC_URL = path.join(staticPath, 'public');
  const PAGES_URL = path.join(staticPath, 'pages');
  const RESOURCE_URL = path.join(staticPath, 'resources');
  const PRIVATE_PEM_PATH = path.join(staticPath, '/RSA/private_pem.txt');
  const PUBLIC_PEM_PATH = path.join(staticPath, '/RSA/public_pem.txt');

  return {
    STATIC_URL: staticPath,
    DB_URL,
    USER_URL,
    TEMPLATES_URL,
    PUBLIC_URL,
    PAGES_URL,
    RESOURCE_URL,
    PRIVATE_PEM_PATH,
    PUBLIC_PEM_PATH
  };
}

/**
 * 创建mysql配置
 * @param {Object} mysql_config mysql配置对象
 * @return {Object} mysql配置对象
 */
function createMysqlConfig(mysql_config) {
  if (!isObject(mysql_config)) {
    throw new Error('Mysql config must be an object.');
  }

  const {
    host = '127.0.0.1',
    port = 3360,
    database = 'database',
    timezone = '+08:00',
    username,
    password
  } = mysql_config;

  if (!username) throw new Error('Username is required.');
  if (!password) throw new Error('Password is required.');
  if (!host) throw new Error('Host cannot be empty.');
  if (!port) throw new Error('Port cannot be empty.');
  if (!database) throw new Error('Database name cannot be empty.');
  if (!timezone) throw new Error('Timezone cannot be empty.');

  return {
    host,
    port,
    database,
    username,
    password,
    timezone
  };
}

/**
 * 应用到配置
 * @param {Object} setting 配置参数对象
 * @return {Object} 配置对象
 */
function applySetting(setting) {
  if (!isObject(setting)) {
    throw new Error('setting must be an object.');
  }

  // 添加其他配置
  for (const key in setting) {
    if (key === 'mysqlConfig' || key === 'staticPath') {
      continue;
    }

    SETTING[key] = setting[key];
  }

  // 如果存在静态文件路径
  if ('staticPath' in setting) {
    const static_config = createStaticPath(setting.staticPath);
    for (const key in static_config) {
      SETTING[key] = static_config[key];
    }
  }

  // 如果存在mysql配置
  if ('mysqlConfig' in setting) {
    const MYSQL_CONFIG = createMysqlConfig(setting.mysqlConfig);
    SETTING.MYSQL_CONFIG = MYSQL_CONFIG;
  }

  // 如果存在私钥证书路径，则读取私钥
  if (SETTING?.PRIVATE_PEM_PATH && fs.existsSync(SETTING?.PRIVATE_PEM_PATH)) {
    SETTING.PRIVATE_PEM = fs.readFileSync(SETTING?.PRIVATE_PEM_PATH);
  }

  return SETTING;
}

module.exports = {
  createStaticPath,
  createMysqlConfig,
  getSetting,
  applySetting
};
