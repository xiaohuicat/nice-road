const fs = require('fs');
const { isObject, isFile, getContentTypeByPath } = require('../utils');

/**
 * 发送数据
 * @param {Object} data
 */
function send(data) {
  let response = this;
  let contentType;

  if (isObject(data)) {
    data = JSON.stringify(data);
    contentType = 'application/json';
  } else {
    contentType = 'text/plain';
  }

  response.writeHead(200, { 'Content-Type': `${contentType}` });
  response.end(data);
  return true;
}


/**
 * 发送json数据
 * @param {Object} data
 */
function sendJson(data) {
  let response = this;
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
  return true;
}

/**
 * 发送文件
 * @param {String} filePath
 * @param {Number} statusCode
 * @param {Boolean} cache 是否开启强制缓存
 */
function sendStreamFile(filePath, statusCode = 200, cache = true) {
  let response = this;
  // 如果文件不存在
  if (!isFile(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end('<body type="font-size:32px;color:purple;">error 404</body>');
    return false;
  }

  let contentType = getContentTypeByPath(filePath);
  response.writeHead(statusCode, {
    'content-type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable', // 1年缓存
    'Expires': new Date(Date.now() + 31536000 * 1000).toUTCString(), // 设置缓存过期时间
  });
  let stream = fs.createReadStream(filePath);
  stream.on('error', function () {
    //错误处理
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.end('<body type="font-size:32px;color:purple;">error 500</body>');
    return false;
  });
  stream.on('close', () => {
    response.end();
    return true;
  });
  stream.pipe(response);
}

module.exports = {
  send,
  sendFile: sendStreamFile,
  sendJson,
  sendStreamFile
};
