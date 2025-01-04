const fs = require('fs');
const http = require('http');
const path = require('path');
const { isObject, getRouters, addProperty } = require('./utils');
const { getReqUrl, send } = require('./tools/index');
const reqTools = require('./tools/reqTools');
const resTools = require('./tools/resTools');
const { applySetting } = require('./setting');
const { rule } = require('./rule');

/**
 * 入口类
 */
class NiceRoad {
  constructor(setting) {
    this.routers = [];  // 路由列表
    this.urls = [];     // 路径列表
    this.rule = rule;
    this.reqBindsDict = { ...reqTools };
    this.resBindsDict = { ...resTools };
    setting && applySetting(setting);
  }

  /**
   * 添加校验规则
   * @param {Function} rule 全局校验函数
   * @returns {Object} 添加成功或失败
   */
  addRule(rule) {
    if (typeof rule === 'function') {
      this.rule = rule;
      return true;
    }

    return false;
  }

  /**
   * 初始化路由
   * @param {String} routerPath 路由地址
   * @returns {void}
   */
  async initRouter(routerPath) {
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
    this.urls = [];
    this.routers.forEach((each) => {
      if (!each) {
        return;
      }

      const url = each.url === '/' ? '/' : each.url.endsWith('/') ? each.url : each.url + '/';
      this.urls.push(url);
    });
  };

  #enter(req, res) {
    req.getReqUrl = getReqUrl;
    const reqUrl = req.getReqUrl();

    let index = this.urls.indexOf(reqUrl);
    if (index == -1) {
      res.send = send;
      res.send({ status: false, msg: 'url not found' });
      return;
    }

    addProperty(req, this.reqBindsDict);
    addProperty(res, this.resBindsDict);

    // 分发到对应的路由
    this.routers[index]?.run?.(req, res, this.rule);
  };

  /**
   * 请求挂载函数对象
   * @param {Object} tools 函数对象
   * @returns {void}
   */
  reqBinds(tools) {
    if (isObject(tools)) {
      Object.keys(tools).forEach((key) => {
        this.reqBindsDict[key] = tools[key];
      });
    }
  }

  /**
   * 响应挂载函数对象
   * @param {Object} tools 函数对象
   * @returns {void}
   */
  resBinds(tools) {
    if (isObject(tools)) {
      Object.keys(tools).forEach((key) => {
        this.resToolsDict[key] = tools[key];
      });
    }
  }

  /**
   * 运行服务器
   * @param {Number} port 端口
   * @param {Function} callback 回调
   * @returns {void}
   */
  run(port = 2023, callback = null) {
    //创建服务器
    this.httpServer = http.createServer(this.#enter); //进入大门处理请求
    this.port = port;
    const defaultFunction = () => {
      console.log(`app is running at port:${port}`);
      console.log(`url: http://localhost:${port}`);
    };
    //指定一个监听的接口
    this.httpServer.listen(port, typeof callback === 'function' ? callback : defaultFunction);
  }
}

module.exports = {
  NiceRoad
};
