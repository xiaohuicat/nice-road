const url = require('url');
const { getContentTypeByPath } = require('../utils');

//挂载到request上，获取post函数的body请求体
function getBody() {
  const req = this;
  return new Promise((resolve) => {
    let str = '';
    req.on('data', function (data) {
      str += data;
    });
    req.on('end', function () {
      try {
        str = JSON.parse(str);
      } catch {
        str = {};
      }
      resolve(str);
    });
  });
}

function getToken() {
  const req = this;
  return req.headers.authorization;
}

// 获取客户端的ip
function getClientIp() {
  const req = this;
  return (
    req.headers['x-forwarded-for'] ||
    req?.connection?.remoteAddress ||
    req?.socket?.remoteAddress ||
    req?.connection?.socket?.remoteAddress ||
    'unknow'
  );
}

// 获取请求数据类型
function getContentType() {
  const req = this;
  let url = req.reqUrl;
  if (!url) return 'unknown';
  return getContentTypeByPath(url);
}

function getCookies() {
  let request = this;
  var cookies = {};
  if (request.headers.cookie) {
    request.headers.cookie.split(';').forEach(function (cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/);
      cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
  }
  return cookies;
}

// 获取请求的参数
function getQuery() {
  let request = this;
  var arg = url.parse(request.url).query;

  if (!arg) return {};

  var argList = arg.indexOf('&') > -1 ? arg.split('&') : [arg];
  var args = {};
  for (each of argList) {
    var key_value = each.indexOf('=') > -1 ? each.split('=') : false;
    if (key_value) args[key_value[0]] = key_value[1];
  }

  return args;
}

function getReqUrl() {
  let request = this;
  // request里面切出标识符字符串
  var requestUrl = request.url;
  // url模块的parse方法 接受一个字符串，返回一个url对象,切出来路径
  var pathName = url.parse(requestUrl).pathname;
  // 对路径解码，防止中文乱码
  var pathName = decodeURI(pathName);
  // 返回结果
  return pathName == '/' ? '/' : pathName.endsWith('/') ? pathName : pathName + '/';
}

function getMethod() {
  const req = this;
  return req.method;
}

function isMethod(method) {
  const req = this;
  return req.method === method.toUpperCase();
}

module.exports = {
  getBody,
  getToken,
  getClientIp,
  getContentType,
  getCookies,
  getQuery,
  getReqUrl,
  getMethod,
  isMethod
};
