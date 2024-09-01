var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// core/utils.js
var require_utils = __commonJS({
  "core/utils.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var Redis = require("ioredis");
    function isObject(obj) {
      return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
    }
    function isFile(filePath) {
      return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    }
    function addProperty(obj, tools2) {
      if (!obj || !tools2) return;
      for (let key in tools2) {
        if (typeof tools2[key] === "function") {
          obj[key] = tools2[key].bind(obj);
        } else {
          obj[key] = tools2[key];
        }
      }
    }
    function readFile(file_path) {
      return new Promise((resolve) => {
        fs.readFile(file_path, "utf8", (err, data) => {
          if (err) {
            resolve(null);
            return;
          }
          resolve(data);
        });
      });
    }
    var getRouters = async (routerPath) => {
      return new Promise((resolve) => {
        let URLs = [];
        fs.readdir(routerPath, (err, files) => {
          if (err) {
            throw console.error("\u8BFB\u53D6router\u6587\u4EF6\u5939\u5931\u8D25 routerPath:", routerPath);
          }
          files.forEach(function(file) {
            const { urls, rules } = require(path.join(routerPath, file));
            if (!urls) {
              throw console.error("\u6CA1\u6709\u627E\u5230urls\uFF0C\u8BF7\u5728\u6587\u4EF6\u4E2D\u4F7F\u7528module.exports\u66B4\u9732urls");
            }
            urls.forEach((e) => {
              if (rules && !e.rules) {
                e.rules = rules;
              }
              if (URLs.indexOf(e) == -1) {
                URLs.push(e);
              }
            });
          });
          resolve(URLs);
        });
      });
    };
    function getContentTypeByPath(filePath) {
      if (!filePath) return "unknown";
      var mime = {
        css: "text/css",
        gif: "image/gif",
        html: "text/html",
        ico: "image/x-icon",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        js: "text/javascript",
        json: "application/json",
        pdf: "application/pdf",
        png: "image/png",
        svg: "image/svg+xml",
        swf: "application/x-shockwave-flash",
        tiff: "image/tiff",
        txt: "text/plain",
        wav: "audio/x-wav",
        wma: "audio/x-ms-wma",
        wmv: "video/x-ms-wmv",
        xml: "text/xml"
      };
      var ext = path.extname(filePath);
      ext = ext ? ext.slice(1) : "unknown";
      var contentType = mime[ext] || "text/plain";
      return contentType;
    }
    function isAsyncFunction(func) {
      return func && func.constructor && func.constructor.name === "AsyncFunction";
    }
    function isPromise(obj) {
      return obj instanceof Promise || obj !== null && typeof obj === "object" && typeof obj.then === "function";
    }
    function safeRunCallback(callback, ...args) {
      return new Promise((resolve) => {
        if (isPromise(callback) || isAsyncFunction(callback)) {
          callback(...args).then((res) => {
            resolve({ status: true, data: res });
          }).catch((error) => {
            resolve({ status: false, msg: error?.message || error });
          });
        } else {
          try {
            const res = callback(...args);
            resolve({ status: true, data: res });
          } catch (error) {
            resolve({ status: false, msg: error?.message || error });
          }
        }
      });
    }
    async function redisEasy(callback) {
      const redis = new Redis();
      await safeRunCallback(callback, redis);
      redis.quit();
    }
    module2.exports = {
      isObject,
      isFile,
      addProperty,
      readFile,
      getRouters,
      getContentTypeByPath,
      safeRunCallback,
      redisEasy
    };
  }
});

// core/tools/reqTools.js
var require_reqTools = __commonJS({
  "core/tools/reqTools.js"(exports2, module2) {
    var url = require("url");
    var { getContentTypeByPath } = require_utils();
    function getBody() {
      let req2 = this;
      return new Promise((resolve) => {
        let str = "";
        req2.on("data", function(data) {
          str += data;
        });
        req2.on("end", function() {
          try {
            str = JSON.parse(str);
          } catch {
            str = {};
          }
          resolve(str);
        });
      });
    }
    function getClientIp() {
      let req2 = this;
      return req2.headers["x-forwarded-for"] || req2?.connection?.remoteAddress || req2?.socket?.remoteAddress || req2?.connection?.socket?.remoteAddress || "unknow";
    }
    function getContentType() {
      let req2 = this;
      let url2 = req2.reqUrl;
      if (!url2) return "unknown";
      return getContentTypeByPath(url2);
    }
    function getCookies() {
      let request = this;
      var cookies = {};
      if (request.headers.cookie) {
        request.headers.cookie.split(";").forEach(function(cookie) {
          var parts = cookie.match(/(.*?)=(.*)$/);
          cookies[parts[1].trim()] = (parts[2] || "").trim();
        });
      }
      return cookies;
    }
    function getQuery() {
      let request = this;
      var arg = url.parse(request.url).query;
      if (!arg) return {};
      var argList = arg.indexOf("&") > -1 ? arg.split("&") : [arg];
      var args = {};
      for (each of argList) {
        var key_value = each.indexOf("=") > -1 ? each.split("=") : false;
        if (key_value) args[key_value[0]] = key_value[1];
      }
      return args;
    }
    function getReqUrl() {
      let request = this;
      var requestUrl = request.url;
      var pathName = url.parse(requestUrl).pathname;
      var pathName = decodeURI(pathName);
      return pathName == "/" ? "/" : pathName.endsWith("/") ? pathName : pathName + "/";
    }
    function getMethod() {
      let req2 = this;
      return req2.method;
    }
    function isMethod(method) {
      let req2 = this;
      return req2.method === method.toUpperCase();
    }
    module2.exports = {
      getBody,
      getClientIp,
      getContentType,
      getCookies,
      getQuery,
      getReqUrl,
      getMethod,
      isMethod
    };
  }
});

// core/tools/resTools.js
var require_resTools = __commonJS({
  "core/tools/resTools.js"(exports2, module2) {
    var fs = require("fs");
    var { isObject, isFile, getContentTypeByPath } = require_utils();
    function send(data) {
      let response = this;
      let contentType;
      if (isObject(data)) {
        data = JSON.stringify(data);
        contentType = "application/json";
      } else {
        contentType = "text/plain";
      }
      response.writeHead(200, { "Content-Type": contentType });
      response.end(data);
      return true;
    }
    function sendJson(data) {
      let response = this;
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(data));
      return true;
    }
    function sendStreamFile(filePath, statusCode = 200) {
      let response = this;
      if (!isFile(filePath)) {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end('<body type="font-size:32px;color:purple;">error 404</body>');
        return false;
      }
      let contentType = getContentTypeByPath(filePath);
      response.writeHead(statusCode, { "content-type": contentType });
      let stream = fs.createReadStream(filePath);
      stream.on("error", function() {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end('<body type="font-size:32px;color:purple;">error 404</body>');
        return false;
      });
      stream.on("close", () => {
        response.end();
        return true;
      });
      stream.pipe(response);
    }
    module2.exports = {
      send,
      sendFile: sendStreamFile,
      sendJson,
      sendStreamFile
    };
  }
});

// core/tools/index.js
var require_tools = __commonJS({
  "core/tools/index.js"(exports2, module2) {
    var {
      getBody,
      getClientIp,
      getContentType,
      getCookies,
      getQuery,
      getReqUrl,
      isMethod
    } = require_reqTools();
    var { send, sendJson, sendFile, sendStreamFile } = require_resTools();
    var { redisEasy } = require_utils();
    module2.exports = {
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
  }
});

// core/crypt/aes_crypt.js
var require_aes_crypt = __commonJS({
  "core/crypt/aes_crypt.js"(exports2, module2) {
    var cryptoJS = require("crypto-js");
    function aes_generate_key() {
      return cryptoJS.randomBytes(32);
    }
    function aes_encrypt(message, key) {
      var keyBytes = cryptoJS.enc.Utf8.parse(key);
      var messageBytes = cryptoJS.enc.Utf8.parse(message);
      var decrypted = cryptoJS.AES.encrypt(messageBytes, keyBytes, {
        mode: cryptoJS.mode.ECB,
        padding: cryptoJS.pad.Pkcs7
      });
      return decrypted.toString();
    }
    function aes_decrypt(message, key) {
      var keyBytes = cryptoJS.enc.Utf8.parse(key);
      var decrypted = cryptoJS.AES.decrypt(message, keyBytes, {
        mode: cryptoJS.mode.ECB,
        padding: cryptoJS.pad.Pkcs7
      });
      return cryptoJS.enc.Utf8.stringify(decrypted).toString();
    }
    module2.exports = {
      aes_generate_key,
      aes_encrypt,
      aes_decrypt
    };
  }
});

// core/crypt/rsa_crypt.js
var require_rsa_crypt = __commonJS({
  "core/crypt/rsa_crypt.js"(exports2, module2) {
    var crypto = require("crypto");
    function rsa_generate_keys() {
      const { generateKeyPairSync } = crypto;
      const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        // 模数长度（位数）
        publicKeyEncoding: {
          type: "pkcs1",
          // 公钥编码格式
          format: "pem"
          // 公钥输出格式
        },
        privateKeyEncoding: {
          type: "pkcs1",
          // 私钥编码格式
          format: "pem"
          // 私钥输出格式
        }
      });
      return { privateKey, publicKey };
    }
    function rsa_encrypt(publicKey, data) {
      const encryptedData = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256"
        },
        Buffer.from(data)
      );
      return encryptedData.toString("base64");
    }
    function rsa_decrypt(privateKey, encryptedData) {
      const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256"
        },
        Buffer.from(encryptedData, "base64")
        // Ensure encryptedData is a Buffer
      );
      return decryptedData.toString("utf-8");
    }
    module2.exports = {
      rsa_generate_keys,
      rsa_decrypt,
      rsa_encrypt
    };
  }
});

// core/token.js
var require_token = __commonJS({
  "core/token.js"(exports2, module2) {
    var jwt = require("jsonwebtoken");
    var Token2 = class {
      constructor(jwt_key) {
        this.jwt_key = jwt_key;
      }
      // 加密
      encrypt(data, time) {
        return jwt.sign(data, this.jwt_key, { expiresIn: time });
      }
      // 解密
      decrypt(token2) {
        try {
          let data = jwt.verify(token2, this.jwt_key);
          return {
            status: true,
            msg: "\u6709\u6548token",
            data
          };
        } catch (e) {
          return {
            status: false,
            msg: "\u65E0\u6548token"
          };
        }
      }
    };
    module2.exports = { Token: Token2 };
  }
});

// core/rule.js
var require_rule = __commonJS({
  "core/rule.js"(exports2, module2) {
    var { aes_decrypt } = require_aes_crypt();
    var { rsa_decrypt } = require_rsa_crypt();
    var { Token: Token2 } = require_token();
    var { redisEasy } = require_utils();
    function verify(token2, jwt_key = "jwt", rsa_private_pem) {
      if (!token2) {
        return false;
      }
      if (rsa_private_pem && !token2.includes("[no-rsa]")) {
        try {
          let front = token2.slice(0, 344);
          let rest = token2.slice(344, 1024);
          let aesKey_timestamp = rsa_decrypt(req.rsa_private_pem, front);
          let aesKey = aesKey_timestamp.slice(0, 16);
          let timestamp = aesKey_timestamp.slice(16, 100);
          let t = Date.now() - timestamp;
          if (t > 1e3 * 30) {
            return false;
          }
          let data = aes_decrypt(rest, aesKey);
          result = Token2(jwt_key).decrypt(data);
          if (!result.status) {
            return false;
          }
          return result.data;
        } catch (error) {
          return false;
        }
      }
      result = Token2(jwt_key).decrypt(token2.replace("[no-rsa]", ""), "utf8");
      if (!result.status) {
        return false;
      }
      return result.data;
    }
    function rule(rules, { method, jwt_key, rsa_private_pem }) {
      return new Promise(async (resolve) => {
        let verify_result;
        if (rules == "no") {
          resolve({ status: true, message: "\u901A\u8FC7\u9A8C\u8BC1", verify: verify_result });
          return;
        }
        if (rules.includes("get")) {
          if (method !== "GET") {
            resolve({ status: false, message: "\u8BF7\u6C42\u65B9\u6CD5\u9519\u8BEF" });
            return;
          }
        }
        if (rules.includes("post")) {
          if (method !== "POST") {
            resolve({ status: false, message: "\u8BF7\u6C42\u65B9\u6CD5\u9519\u8BEF" });
            return;
          }
        }
        if (rules.includes("user") || rules.includes("admin") || rules.includes("supervision")) {
          verify_result = verify(token, jwt_key, rsa_private_pem);
          if (!verify_result) {
            resolve({ status: false, message: "\u8BBF\u95EE\u5185\u5BB9\u9700\u767B\u5F55" });
            return;
          }
        }
        if (rules.includes("admin")) {
          let role = verify_result.role;
          if (role != "\u7BA1\u7406\u5458") {
            resolve({ status: false, message: "\u65E0\u8BBF\u95EE\u6743\u9650" });
          }
        }
        if (rules.includes("supervision")) {
          let role = verify_result.role;
          let user_id = verify_result.user_id;
          if (role == "\u8003\u6838\u7EC4" || role == "\u7BA1\u7406\u5458") {
            if (role == "\u7BA1\u7406\u5458") {
            } else {
              const listData = await redisEasy(async (redis) => {
                return await redis.lrange("supervision", 0, -1);
              });
              if (listData.filter((e) => e == user_id).length > 0) {
              } else {
                resolve({ status: false, message: "\u8003\u6838\u7EC4\u6210\u5458\uFF0C\u9700\u7533\u8BF7\u6743\u9650" });
                return;
              }
            }
          } else {
            resolve({ status: false, message: "\u975E\u8003\u6838\u7EC4\u6210\u5458\uFF0C\u65E0\u8BBF\u95EE\u6743\u9650" });
            return;
          }
        }
        resolve({ status: true, message: "\u901A\u8FC7\u9A8C\u8BC1", verify: verify_result });
      });
    }
    module2.exports = {
      rule
    };
  }
});

// core/NiceRoad.js
var require_NiceRoad = __commonJS({
  "core/NiceRoad.js"(exports2, module2) {
    var fs = require("fs");
    var http = require("http");
    var path = require("path");
    var { isObject, getRouters, addProperty, safeRunCallback } = require_utils();
    var { getReqUrl, send } = require_tools();
    var reqTools2 = require_reqTools();
    var resTools2 = require_resTools();
    var { rule } = require_rule();
    async function handleMiddleware(req2, res, middlewareList) {
      let isPassMiddleware = true;
      for (const each2 of middlewareList) {
        const { status, msg, data } = await safeRunCallback(each2, req2, res);
        if (!status) {
          isPassMiddleware = false;
          console.error("\u8FD0\u884C\u4E2D\u95F4\u4EF6\u51FA\u9519\uFF1A", msg);
          res.send({ status: false, msg: "middleware error" });
          break;
        }
        if (!data) {
          isPassMiddleware = false;
          break;
        }
      }
      return isPassMiddleware;
    }
    var ruleCaller = (rule2, method, setting) => {
      let rsa_private_pem;
      if (setting?.rsa_private_path && fs.existsSync(setting.rsa_private_path)) {
        rsa_private_pem = fs.readFileSync(setting.rsa_private_path);
      }
      const { jwt_key } = setting;
      return (rules) => rule2(rules, { method, jwt_key, rsa_private_pem });
    };
    var NiceRoad2 = class {
      constructor(setting) {
        this.setting = setting;
        this.routers = [];
        this.urls = [];
        this.rule = rule;
        this.reqBindsDict = { ...reqTools2 };
        this.resBindsDict = { ...resTools2 };
        this.middlewareList = [];
      }
      addMiddleware(middleware) {
        if (typeof middleware === "function") {
          this.middlewareList.push(middleware);
          return true;
        }
        return false;
      }
      setRule(rule2) {
        if (typeof rule2 === "function") {
          this.rule = rule2;
          return true;
        }
        return false;
      }
      initRouter = async (routerPath) => {
        if (!routerPath) {
          throw console.error("routerPath is null");
        }
        if (!path.isAbsolute(routerPath)) {
          routerPath = path.join(process.cwd(), routerPath);
          if (!fs.existsSync(routerPath)) {
            console.error(`routerPath is not exists`);
            return;
          }
        }
        this.routers = await getRouters(routerPath);
        this.urls = this.routers.map((each2) => {
          return each2.url == "/" ? "/" : each2.url.endsWith("/") ? each2.url : each2.url + "/";
        });
      };
      enter = async (req2, res) => {
        req2.getReqUrl = getReqUrl;
        const reqUrl = req2.getReqUrl();
        let index = this.urls.indexOf(reqUrl);
        if (index == -1) {
          res.send = send;
          res.send({ status: false, msg: "url not found" });
          return;
        }
        addProperty(req2, this.reqBindsDict);
        addProperty(res, this.resBindsDict);
        if (!await handleMiddleware(req2, res, this.middlewareList)) {
          return;
        }
        this.routers[index]?.run?.(req2, res, ruleCaller(this?.rule, req2?.getMethod(), this?.setting));
      };
      reqBinds(tools2) {
        if (isObject(tools2)) {
          Object.keys(tools2).forEach((key) => {
            this.reqBindsDict[key] = tools2[key];
          });
        }
      }
      resBinds(tools2) {
        if (isObject(tools2)) {
          Object.keys(tools2).forEach((key) => {
            this.resToolsDict[key] = tools2[key];
          });
        }
      }
      run(port = 2023, callback = null) {
        this.httpServer = http.createServer(this.enter);
        this.port = port;
        const defaultFunction = () => {
          console.log(`app is running at port:${port}`);
          console.log(`url: http://localhost:${port}`);
        };
        this.httpServer.listen(port, callback ? callback : defaultFunction);
      }
    };
    module2.exports = {
      NiceRoad: NiceRoad2
    };
  }
});

// core/router.js
var require_router = __commonJS({
  "core/router.js"(exports2, module2) {
    var { safeRunCallback } = require_utils();
    var Router2 = class {
      constructor(url, callback, rules) {
        this.url = url;
        this.callback = callback;
        this.rules = rules;
      }
      async run(req2, res, rule) {
        if (!this.url || !this.callback) {
          console.error(`[warning]\u9519\u8BEF\u7684\u8DEF\u7531`);
          return;
        }
        if (!this.rules) {
          const { status, msg } = await safeRunCallback(this.callback, req2, res);
          if (!status) {
            res.send({ status: true, msg });
          }
          return;
        }
        let ret = await rule(this.rules);
        if (ret?.status) {
          req2.ruleResult = ret;
          const { status, msg } = await safeRunCallback(this.callback, req2, res);
          if (!status) {
            res.send({ status: true, msg });
          }
          return;
        } else {
          res.send({ status: false, msg: ret?.message || "verify error" });
          return;
        }
      }
    };
    function npath2(url, callback, rules) {
      if (typeof url === "string" && typeof callback === "function") {
        return new Router2(url, callback, rules);
      } else if (typeof url === "object" && typeof callback === "undefined") {
        return new Router2(url?.url, url?.callback, url?.rules);
      } else {
        console.error(`[warning]\u9519\u8BEF\u7684\u8DEF\u7531\u914D\u7F6E`);
      }
    }
    module2.exports = {
      npath: npath2,
      Router: Router2
    };
  }
});

// core/createStaticPath.js
var require_createStaticPath = __commonJS({
  "core/createStaticPath.js"(exports2, module2) {
    var path = require("path");
    function createStaticPath2(static_url) {
      const db_url = path.join(static_url, "databases");
      const user_url = path.join(static_url, "users");
      const templates_url = path.join(static_url, "templates");
      const public_url = path.join(static_url, "public");
      const pages_url = path.join(static_url, "pages");
      const private_pem_path = path.join(static_url, "/RSA/private_pem.txt");
      const public_pem_path = path.join(static_url, "/RSA/public_pem.txt");
      return {
        static_url,
        db_url,
        user_url,
        templates_url,
        public_url,
        pages_url,
        private_pem_path,
        public_pem_path
      };
    }
    module2.exports = {
      createStaticPath: createStaticPath2
    };
  }
});

// core/createSequelize.js
var require_createSequelize = __commonJS({
  "core/createSequelize.js"(exports2, module2) {
    var Sequelize2 = require("sequelize");
    var sequelize;
    function createSequelize2(mysql_config) {
      if (sequelize) {
        return sequelize;
      }
      sequelize = new Sequelize2(mysql_config.database, mysql_config.username, mysql_config.password, {
        host: mysql_config.host,
        port: mysql_config.port,
        dialect: "mysql",
        timezone: mysql_config.timezone,
        pool: {
          max: 5,
          min: 0,
          idle: 3e4
        }
      });
      return sequelize;
    }
    module2.exports = {
      createSequelize: createSequelize2,
      Sequelize: Sequelize2
    };
  }
});

// core/crypt/index.js
var require_crypt = __commonJS({
  "core/crypt/index.js"(exports2, module2) {
    var {
      aes_generate_key,
      aes_encrypt,
      aes_decrypt
    } = require_aes_crypt();
    var {
      rsa_generate_keys,
      rsa_decrypt,
      rsa_encrypt
    } = require_rsa_crypt();
    module2.exports = {
      aes_generate_key,
      aes_encrypt,
      aes_decrypt,
      rsa_generate_keys,
      rsa_decrypt,
      rsa_encrypt
    };
  }
});

// core/index.js
var { NiceRoad } = require_NiceRoad();
var { npath, Router } = require_router();
var { createStaticPath } = require_createStaticPath();
var { createSequelize, Sequelize } = require_createSequelize();
var { reqTools } = require_reqTools();
var { resTools } = require_resTools();
var httpTools = require_tools();
var utils = require_utils();
var Token = require_token();
var tools = {
  ...utils,
  Token
};
var crypt = require_crypt();
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
  Sequelize
};
