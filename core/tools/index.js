const {
  getBody,
  getClientIp,
  getContentType,
  getCookies,
  getQuery,
  getReqUrl,
  isMethod
} = require('./reqTools');

const { send, sendJson, sendFile, sendStreamFile } = require('./resTools');

const { redisEasy } = require('../utils');

module.exports = {
  getBody,
  getClientIp,
  getContentType,
  getCookies,
  getQuery,
  getReqUrl,
  isMethod,
  send,
  sendJson,
  sendFile,
  sendStreamFile,
  redisEasy
};
