const { NiceRoad } = require('./NiceRoad');
const { npath, Router } = require('./router');
const { useSequelize, syncSequelize, Sequelize, DataTypes, Op } = require('./Sequelize');
const { reqTools } = require('./tools/reqTools');
const { resTools } = require('./tools/resTools');
const httpTools = require('./tools');
// 工具类
const utils = require('./utils');
const Token = require('./tools/token');
const tools = {
  ...utils,
  Token
};

const { rule, ruleBreak, ruleNext, multipleValidate, asyncMultipleValidate } = require('./rule');
const crypt = require('./crypt');
const { applySetting, getSetting } = require('./setting');

module.exports = {
  NiceRoad,
  Router,
  npath,
  reqTools,
  resTools,
  httpTools,
  tools,
  crypt,
  applySetting,
  getSetting,
  useSequelize,
  syncSequelize,
  DataTypes,
  Sequelize,
  Op,
  rule,
  ruleBreak,
  ruleNext,
  multipleValidate,
  asyncMultipleValidate,
};
