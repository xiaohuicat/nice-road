const fs = require('fs');
const http = require('http');
const path = require('path');

const { isObject, getRouters, addProperty, safeRunCallback } = require('./utils');
const { getReqUrl, send } = require('./tools/index');
const reqTools = require('./tools/reqTools');
const resTools = require('./tools/resTools');
const {rule} = require('./rule');

/**
 * 处理中间件
 * @param {Object} req
 * @param {Object} res
 * @param {Array} middlewareList
 */
async function handleMiddleware(req, res, middlewareList) {
  let isPassMiddleware = true;
  for (const each of middlewareList) {
    const {status, msg, data} = await safeRunCallback(each, req, res);
    // 运行中间件出错
    if (!status) {
      isPassMiddleware = false;
      console.error('运行中间件出错：', msg);
      res.send({status: false, msg: 'middleware error'});
      break;
    }
    // 如果中间件不通过
    if (!data) {
      isPassMiddleware = false;
      break;
    }
  }

  return isPassMiddleware;
}

/**
 * 规则调用器
 * @param {Function} rule
 * @param {String} method
 * @param {Object} setting
 */
const ruleCaller = (rule, token, method, setting) => {
  // 如果存在私钥路径，则读取私钥
  let rsa_private_pem;
  if (setting?.rsa_private_path && fs.existsSync(setting.rsa_private_path)) {
    rsa_private_pem = fs.readFileSync(setting.rsa_private_path);
  }

  const {jwt_key} = setting;
  return rules => rule(rules, {token, method, jwt_key, rsa_private_pem});
};

/**
 * 入口类
 */
class NiceRoad {
  constructor(setting) {
    this.setting = setting;
    this.routers = [];                 // 路由列表
    this.urls = [];                    // 路径列表
    this.rule = rule;
    this.reqBindsDict = {...reqTools};
    this.resBindsDict = {...resTools};
    this.middlewareList = [];
  }

  addMiddleware(middleware) {
    if (typeof middleware === 'function') {
      this.middlewareList.push(middleware);
      return true;
    }

    return false;
  };

  setRule(rule) {
    if (typeof rule === 'function') {
      this.rule = rule;
      return true;
    }

    return false;
  };

  initRouter = async (routerPath) => {
    if (!routerPath) {
      throw console.error('routerPath is null');
    }
    // 如果是相对路径，则拼接绝对路径
    if (!path.isAbsolute(routerPath)) {
      routerPath = path.join(process.cwd(), routerPath);
      if (!fs.existsSync(routerPath)) {
        console.error(`routerPath is not exists`);
        return;
      }
    }
    // 获取路由参数
    this.routers = await getRouters(routerPath);
    this.urls = this.routers.map((each) => {
      return each.url == '/' ? '/' : each.url.endsWith('/') ? each.url : each.url + '/';
    });
  };

  enter = async (req, res) => {
    req.getReqUrl = getReqUrl;
    const reqUrl = req.getReqUrl();

    let index = this.urls.indexOf(reqUrl);
    if (index == -1) {
      res.send = send;
      res.send({status: false, msg: 'url not found'});
      return;
    }
    
    addProperty(req, this.reqBindsDict);
    addProperty(res, this.resBindsDict);

    // 中间件校验
    if (!(await handleMiddleware(req, res, this.middlewareList))) {
      return;
    }

    // 分发到对应的路由
    this.routers[index]?.run?.(req, res, ruleCaller(this?.rule, req?.headers?.authorization ,req?.getMethod(), this?.setting));
  };

  reqBinds(tools) {
    if (isObject(tools)) {
      Object.keys(tools).forEach((key) => {
        this.reqBindsDict[key] = tools[key];
      });
    }
  }

  resBinds(tools) {
    if (isObject(tools)) {
      Object.keys(tools).forEach((key) => {
        this.resToolsDict[key] = tools[key];
      });
    }
  }

  run(port = 2023, callback = null) {
    //创建服务器
    this.httpServer = http.createServer(this.enter); //进入大门处理请求
    this.port = port;
    const defaultFunction = () => {
      console.log(`app is running at port:${port}`);
      console.log(`url: http://localhost:${port}`);
    };
    //指定一个监听的接口
    this.httpServer.listen(port, callback ? callback : defaultFunction);
  }
}

module.exports = {
  NiceRoad,
};
