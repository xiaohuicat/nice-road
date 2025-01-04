const url = require('url');
const { getContentTypeByPath } = require('../utils');

/**
 * 挂载到request上，获取post函数的body请求体
 * @returns {Promise} 请求体
 */
function getBody(body) {
  const req = this;
  return new Promise((resolve) => {
    let str = '';
    req.on('data', function (data) {
      str += data;
    });
    req.on('end', function () {
      body = body ? body : {};
      try {
        Object.assign(body, JSON.parse(str));
      } catch {}
      resolve(body);
    });
  });
}

/**
 * 挂载到request上，获取post函数的file请求体
 * @returns {Promise} 请求体
 */
function getFiles() {
  const req = this;
  return new Promise((resolve, reject) => {
    const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
    let rawData = '';
    const fields = {};
    const files = [];
    
    req.on('data', chunk => {
      rawData += chunk;
    });

    req.on('end', () => {
      const parts = rawData.split(`--${boundary}`);
      for (const part of parts) {
        if (part && part !== '--\r\n') {
          const [header, ...body] = part.split('\r\n\r\n');
          const content = body.join('\r\n\r\n').trim();
          // 有filename的部分是文件名，没有的是普通字段
          if (header.includes('filename')) {
            const filename = header.match(/filename="(.+)"/)[1];
            const mimetype = header.match(/Content-Type: (.+)/)[1];
            files.push({ filename, mimetype, buffer: Buffer.from(content, 'binary') });
          } else {
            const fieldname = header.match(/name="(.+)"/)[1];
            fields[fieldname] = content;
          }
        }
      }

      resolve({fields, files});
    });

    req.on('error', err => {
      reject(err);
    });
  });
}

/**
 * 挂载到request上，获取post函数的文件
 * @returns {Promise} 文件
 */
function getToken() {
  return this?.headers?.authorization;
}

/**
 * 获取客户端的ip
 * @returns {String} ip地址
 */
function getClientIp(defaultValue='unknow') {
  const req = this;
  return (
    req.headers['x-forwarded-for'] ||
    req?.connection?.remoteAddress ||
    req?.socket?.remoteAddress ||
    req?.connection?.socket?.remoteAddress || defaultValue
  );
}

/**
 * 获取请求数据类型
 * @returns {String} 请求数据类型
 */
function getContentType() {
  const req = this;
  let url = req.reqUrl;
  if (!url) return 'unknown';
  return getContentTypeByPath(url);
}

/**
 * 获取cookie
 * @returns {Object} cookie对象
 */
function getCookies() {
  const request = this;
  const cookies = {};
  if (request.headers.cookie) {
    request.headers.cookie.split(';').forEach(function (cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/);
      cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
  }

  return cookies;
}

/**
 * 获取请求的参数
 * @returns {Object} 查询参数对象
 */
function getQuery() {
  const request = this;
  const arg = url.parse(request.url).query;

  if (!arg) return {};

  const argList = arg.indexOf('&') > -1 ? arg.split('&') : [arg];
  const args = {};
  for (each of argList) {
    const key_value = each.indexOf('=') > -1 ? each.split('=') : false;
    if (key_value) {
      args[key_value[0]] = key_value[1];
    }
  }

  return args;
}

/**
 * 获取请求路径
 * @return {String} 请求路径
 */
function getReqUrl() {
  const req = this;
  // request里面切出标识符字符串
  const requestUrl = req.url;
  // url模块的parse方法 接受一个字符串，返回一个url对象,切出来路径
  let pathName = url.parse(requestUrl).pathname;
  // 对路径解码，防止中文乱码
  pathName = decodeURI(pathName);
  // 返回结果
  return pathName == '/' ? '/' : pathName.endsWith('/') ? pathName : pathName + '/';
}

/**
 * 获取请求方法
 * @return {String} 请求方法
 */
function getMethod() {
  return this.method;
}

/**
 * 判断请求方法是否是method
 * @param {String} method 请求方法
 * @return {Boolean}
 */
function isMethod(method) {
  return this.method === method.toUpperCase();
}

/**
 * 获取用户信息
 * @param {String} key 用户信息字段名
 */
function getUser(key) {
  const user = this?.ruleResult?.params ?? {};
  if (!key) {
    return user;
  } else {
    return user?.[key];
  }
}

module.exports = {
  getBody,
  getFiles,
  getToken,
  getClientIp,
  getContentType,
  getCookies,
  getQuery,
  getReqUrl,
  getMethod,
  isMethod,
  getUser,
};
