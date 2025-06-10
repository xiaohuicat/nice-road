const { aes_decrypt } = require('./crypt/aes_crypt');
const { rsa_decrypt } = require('./crypt/rsa_crypt');
const { Token } = require('./tools/token');
const { isPromise, isAsyncFunction, isNull } = require('./utils');

/**
 * 多条件校验，返回true
 * @param {Array} conditions 条件数组
 * @return {fail: false, msg: *} 校验结果
 */
function multipleValidate(conditions) {
  if (!Array.isArray(conditions)) {
    throw new Error('conditions参数必须为数组');
  }

  let ret = false;
  let errorMsg = '';
  let innerParams;

  for (let i = 0; i < conditions.length; i++) {
    const each = conditions[i];
    if (typeof each === 'function') {
      const { fail, msg, params } = each(innerParams);
      ret = fail;
      errorMsg = msg;
      innerParams = params;
    } else if (Array.isArray(each) && each.length === 2) {
      ret = each[0];
      errorMsg = each[1];
    } else {
      ret = each?.fail;
      errorMsg = each?.msg;
    }

    if (ret) {
      break;
    }
  }

  return { fail: ret, msg: errorMsg, params: innerParams };
}

/**
 * 多条件校验，返回true
 * @param {Array} conditions 条件数组
 * @return {fail: false, msg: *} 校验结果
 */
async function asyncMultipleValidate(conditions) {
  if (!Array.isArray(conditions)) {
    throw new Error('conditions参数必须为数组');
  }

  let ret = false;
  let errorMsg = '';
  let innerParams;

  for (let i = 0; i < conditions.length; i++) {
    const each = conditions[i];
    if (typeof each === 'function') {
      const { fail, msg, params } = isAsyncFunction(each) ? await each(innerParams) : each(innerParams);
      ret = fail;
      errorMsg = msg;
      innerParams = params;
    } else if (isPromise(each)) {
      const { fail, msg, params } = await each(innerParams);
      ret = fail;
      errorMsg = msg;
      innerParams = params;
    } else if (Array.isArray(each) && each.length === 2) {
      ret = each[0];
      errorMsg = each[1];
    } else {
      ret = each?.fail;
      errorMsg = each?.msg;
    }

    if (ret) {
      break;
    }
  }

  return { fail: ret, msg: errorMsg, params: innerParams };
}

/**
 * 校验下一个
 * @param {Array} rules 规则列表
 * @return {fail: false, msg: *}
 */
function ruleNext(msg, params) {
  const result = { fail: false };
  if (!isNull(msg)) {
    result.msg = msg;
  }

  if (!isNull(params)) {
    result.params = params;
  }

  return result;
}

/**
 * 跳出校验
 * @param msg 原因
 * @param params 参数
 * @returns {fail: true, msg: *, params: *}
 */
function ruleBreak(msg, params) {
  const result = { fail: true };
  if (!isNull(msg)) {
    result.msg = msg;
  }

  if (!isNull(params)) {
    result.params = params;
  }

  return result;
}

/**
 * rsa解密
 * @param {String} token 解密文本
 * @param {String} rsa_private_pem 私钥
 * @returns {Object} 校验结果
 */
function rsaVerify(token, rsa_private_pem) {
  try {
    let front = token.slice(0, 344);
    let rest = token.slice(344, 1024);
    let aesKey_timestamp = rsa_decrypt(rsa_private_pem, front);
    let timestamp = aesKey_timestamp.slice(-13);
    let aesKey = aesKey_timestamp.slice(0, -13);
    
    let t = Date.now() - timestamp;
    if (t > 1000 * 30) {
      return false;
    }

    let data = aes_decrypt(rest, aesKey);
    return ruleNext('rsa解密成功', data);
  } catch (error) {
    return ruleBreak('rsa解密失败');
  }
}

/**
 * jwt解密
 * @param {String} token 解密文本
 * @param {String} jwt_key jwt密钥
 * @returns {Object} 校验结果
 */
function jwtVerify(token, jwt_key = 'jwt') {
  let result = new Token(jwt_key).decrypt(token, 'utf8');
  if (!result.status) {
    return ruleBreak(result?.msg ?? 'jwt解密失败');
  }

  return ruleNext('jwt解密成功', result.data);
}

//登录验证，返回json
function userRSAVerify(token, jwt_key = 'jwt', rsa_private_pem) {
  const { fail, params, msg } = multipleValidate([
    [!token, 'token为空'],
    () => {
      // 如果没有no-rsa加密，默认是token是经过rsa加密的
      if (rsa_private_pem && !token.includes('[no-rsa]')) {
        return rsaVerify(token, rsa_private_pem);
      }

      return ruleNext('无需rsa解密', token);
    },
    getToken => jwtVerify(getToken?.replace('[no-rsa]', ''), jwt_key)
  ]);

  if (fail) {
    return ruleBreak(msg, params);
  } else {
    return ruleNext(msg, params);
  }
}

/**
 * 校验规则
 * @param {Array} rules 规则列表，在路由中配置的规则，如['GET']
 * @param {Object} param {token, method, jwt_key, rsa_private_pem}
 * @return {Object} 校验结果
 */
function rule(rules, { token, method, jwt_key, rsa_private_pem }) {
  return multipleValidate([
    [rules === 'NO', '无需校验'],
    [rules.includes('GET') && method !== 'GET', '请求方法错误'],
    [rules.includes('POST') && method !== 'POST', '请求方法错误'],
    () => {
      let result;
      if (rules.includes('USER') || rules.includes('ADMIN')) {
        const { fail, params, msg } = userRSAVerify(token, jwt_key, rsa_private_pem);
        if (fail) {
          return ruleBreak(msg);
        }

        result = params;
      }

      if (rules.includes('ADMIN') && result?.role !== '管理员') {
        return ruleBreak('无访问权限');
      }

      return ruleNext('校验通过', result);
    }
  ]);
}

module.exports = {
  rule,
  multipleValidate,
  asyncMultipleValidate,
  ruleNext,
  ruleBreak,
  jwtVerify,
  userRSAVerify,
};
