const path = require('path');
const { isObject } = require('./utils');

// 配置文件对象
const SETTING = {};

/**
 * 获取配置
 */
function getSetting() {
  return SETTING;
}

/**
 * 创建静态文件路径
 * @param {String} staticPath
 */
function createStaticPath(staticPath) {
  const DB_URL = path.join(staticPath, 'databases');
  const USER_URL = path.join(staticPath, 'users');
  const TEMPLATES_URL = path.join(staticPath, 'templates');
  const PUBLIC_URL = path.join(staticPath, 'public');
  const PAGES_URL = path.join(staticPath, 'pages');
  const PRIVATE_PEM_PATH = path.join(staticPath, '/RSA/private_pem.txt');
  const PUBLIC_PEM_PATH = path.join(staticPath, '/RSA/public_pem.txt');

  return {
    STATIC_URL: staticPath,
    DB_URL,
    USER_URL,
    TEMPLATES_URL,
    PUBLIC_URL,
    PAGES_URL,
    PRIVATE_PEM_PATH,
    PUBLIC_PEM_PATH
  };
}

/**
 * 创建mysql配置
 * @param {Object} mysql_config
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
 * 创建配置
 * @param {Object} setting
 */
function applySetting(setting) {
  if (!isObject(setting) || !('staticPath' in setting) || !('mysqlConfig' in setting)) {
    throw new Error('Setting must has staticPath and mysqlConfig.');
  }

  const static_config = createStaticPath(setting.staticPath);
  const MYSQL_CONFIG = createMysqlConfig(setting.mysqlConfig);
  SETTING.MYSQL_CONFIG = MYSQL_CONFIG;

  for (const key in setting) {
    if (key === 'mysqlConfig' || key === 'staticPath') {
      continue;
    }

    SETTING[key] = setting[key];
  }

  for (const key in static_config) {
    SETTING[key] = static_config[key];
  }

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
