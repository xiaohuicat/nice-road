const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');

/**
 * 判断输入参数是否为null，当值为null或undefined
 * @param {*} obj 判断参数
 * @returns {Boolean} 是否为空
 */
function isNull(obj) {
  return obj === null || obj === undefined;
}

/**
 * 判断是否是对象，排除null和数组
 * @param {Object} obj 判断参数
 * @returns {Boolean} 是否是对象
 */
function isObject(obj) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

/**
 * 判断是否是文件，检查本地是否存在文件
 * @param {String} filePath 文件路径
 * @returns {Boolean} 是否是对象
 */
function isFile(filePath) {
  try {
    // 先检查路径是否存在
    if (fs.existsSync(filePath)) {
      // 获取文件状态，并检查是否为文件
      return fs.statSync(filePath).isFile();
    }
    // 如果路径不存在，返回 false
    return false;
  } catch (error) {
    console.error('Error checking file:', error);
    return false;
  }
}

/**
 * 添加属性，将一个对象的属性添加都目标对象
 * @param {Object} obj 被添加的对象
 * @param {Object} tools 添加对象
 * @returns {void}
 */
function addProperty(obj, tools) {
  if (!obj || !tools) return;
  for (let key in tools) {
    if (typeof tools[key] === 'function') {
      obj[key] = tools[key].bind(obj);
    } else {
      obj[key] = tools[key];
    }
  }
}

/**
 * 读取文件
 * @param {String} file_path 文件路径
 * @returns {Promise} 读取数据
 */
function readFile(file_path) {
  return new Promise((resolve) => {
    fs.readFile(file_path, 'utf8', (err, data) => {
      if (err) {
        resolve(null);
        return;
      }

      resolve(data);
    });
  });
}

// 获取路由对象
const getRouters = async (routerPath) => {
  return new Promise((resolve) => {
    let URLs = []; // 路由列表
    fs.readdir(routerPath, (err, files) => {
      // 读取路由文件失败
      if (err) {
        throw console.error('读取router文件夹失败 routerPath:', routerPath);
      }

      // 对每个路由文件
      files.forEach(function (file) {
        const { urls, rules } = require(path.join(routerPath, file));
        if (!urls) {
          throw console.error('没有找到urls，请在文件中使用module.exports暴露urls');
        }

        urls.forEach((e) => {
          if (!e) {
            return;
          }

          if (rules && !e?.rules) {
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

// 获取请求数据类型
function getContentTypeByPath(filePath, defaultValue='text/plain') {
  if (!filePath) return 'unknown';
  // mime类型
  var mime = {
    css: 'text/css',
    gif: 'image/gif',
    html: 'text/html',
    ico: 'image/x-icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'text/javascript',
    json: 'application/json',
    pdf: 'application/pdf',
    png: 'image/png',
    svg: 'image/svg+xml',
    swf: 'application/x-shockwave-flash',
    tiff: 'image/tiff',
    txt: 'text/plain',
    wav: 'audio/x-wav',
    wma: 'audio/x-ms-wma',
    wmv: 'video/x-ms-wmv',
    xml: 'text/xml'
  };
  var ext = path.extname(filePath);
  ext = ext ? ext.slice(1) : 'unknown';
  var contentType = mime[ext] ?? defaultValue;
  return contentType;
}

/**
 * 判断是否是异步函数
 * @param {Function} func
 */
function isAsyncFunction(func) {
  return func && func.constructor && func.constructor.name === 'AsyncFunction';
}

/**
 * 判断是否是Promise
 * @param {Object} obj
 */
function isPromise(obj) {
  return (
    obj instanceof Promise ||
    (obj !== null && typeof obj === 'object' && typeof obj.then === 'function')
  );
}

/**
 * 安全运行回调函数
 * @param {Function} callback
 * @returns {Promise}
 */
function safeRunCallback(callback, ...args) {
  return new Promise((resolve) => {
    if (isPromise(callback) || isAsyncFunction(callback)) {
      callback(...args)
        .then((res) => {
          resolve({ status: true, data: res });
        })
        .catch((error) => {
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

/**
 * 封装redis操作
 * @param {Function} callback
 */
async function redisEasy(callback) {
  const redis = new Redis();
  await safeRunCallback(callback, redis);
  redis.quit();
}

module.exports = {
  isNull,
  isObject,
  isFile,
  isPromise,
  isAsyncFunction,
  addProperty,
  readFile,
  getRouters,
  getContentTypeByPath,
  safeRunCallback,
  redisEasy,
};
