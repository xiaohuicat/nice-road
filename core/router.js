const { getSetting } = require('./setting');
const { safeRunCallback } = require('./utils');

/**
 * 路由类
 */
class Router {
  constructor(url, callback, rules) {
    this.url = url;
    this.callback = callback;
    this.rules = rules;
  }
  async run(req, res, rule) {
    // 错误的路由
    if (!this.url || !this.callback) {
      console.error(`[warning]错误的路由`);
      return;
    }

    const setting = getSetting();
    const __DEV__ = setting?.__DEV__;
    // 没有校验规则
    if (!this.rules) {
      const { status, msg } = await safeRunCallback(this.callback, req, res);
      if (!status) {
        res.send({ status: false, msg: __DEV__ ? msg : '发生错误！' });
      }

      return;
    }

    // 验证规则
    const option = {
      token: req.getToken(),
      method: req.getMethod(),
      jwt_key: setting?.JWT_KEY,
      rsa_private_pem: setting?.PRIVATE_PEM,
    };
    let ret = await rule(this.rules, option);
    if (ret?.fail) {
      res.send({ status: false, msg: ret?.msg || 'verify error' });
      return;
    }

    req.ruleResult = ret;
    const { status, msg } = await safeRunCallback(this.callback, req, res);
    if (!status) {
      res.send({ status: false, msg: __DEV__ ? msg : '发生错误！' });
    }
  }
}

/**
 * 路由配置
 * @param {string} url 路由地址
 * @param {function} callback 路由回调函数
 * @param {object} rules 校验规则
 */
function npath(url, callback, rules) {
  if (typeof url === 'string' && typeof callback === 'function') {
    return new Router(url, callback, rules);
  } else if (typeof url === 'object' && typeof callback === 'undefined') {
    return new Router(url?.url, url?.callback, url?.rules);
  } else {
    console.error(`[warning]错误的路由配置`);
  }
}

module.exports = {
  npath,
  Router
};
