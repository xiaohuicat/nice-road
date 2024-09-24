const {NiceRoad} = require('./NiceRoad');
const {npath, Router} = require('./router');
const {createStaticPath} = require('./createStaticPath');
const {createSequelize, Sequelize} = require('./createSequelize');
const {reqTools} = require('./tools/reqTools');
const {resTools} = require('./tools/resTools');
const httpTools = require('./tools');
// 工具类
const utils = require('./utils');
const Token = require('./token');
const tools = {
  ...utils,
  Token,
};

const {rule, ruleBreak, ruleNext, multipleValidate} = require('./rule');

const crypt = require('./crypt');

module.exports = {
  NiceRoad,
  Router,
  npath,
  reqTools,
  resTools,
  httpTools,
  tools,
  crypt,
  createStaticPath,
  createSequelize,
  Sequelize,
  rule,
  ruleBreak,
  ruleNext,
  multipleValidate,
};