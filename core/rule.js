const { aes_decrypt } = require('./crypt/aes_crypt');
const { rsa_decrypt } = require('./crypt/rsa_crypt');
const { Token } = require('./token');
const { redisEasy } = require('./utils');

//登录验证，返回json
function verify(token, jwt_key = 'jwt', rsa_private_pem) {
  if (!token) {
    return false;
  }

  // 如果没有no-rsa加密，默认是token是经过rsa加密的
  if (rsa_private_pem && !token.includes('[no-rsa]')) {
    try {
      let front = token.slice(0, 344);
      let rest = token.slice(344, 1024);
      let aesKey_timestamp = rsa_decrypt(req.rsa_private_pem, front);
      let aesKey = aesKey_timestamp.slice(0, 16);
      let timestamp = aesKey_timestamp.slice(16, 100);
      let t = Date.now() - timestamp;
      if (t > 1000 * 30) {
        return false;
      }
      let data = aes_decrypt(rest, aesKey);
      result = Token(jwt_key).decrypt(data);
      if (!result.status) {
        return false;
      }

      return result.data;

    } catch (error) {
      return false;
    }
  }

  result = Token(jwt_key).decrypt(token.replace('[no-rsa]', ''), 'utf8');
  if (!result.status) {
    return false;
  }

  return result.data;
}

/**
 * 校验规则
 * @param {Array} rules
 * @param {Object} param
 */
function rule(rules, {method, jwt_key, rsa_private_pem}) {
  return new Promise(async (resolve) => {
    let verify_result;

    if (rules == 'no') {
      resolve({ status: true, message: '通过验证', verify: verify_result });
      return;
    }

    // 如果需要校验get方法
    if (rules.includes('get')) {
      if (method !== 'GET') {
        resolve({ status: false, message: '请求方法错误' });
        return;
      }
    }

    // 如果需要校验post方法
    if (rules.includes('post')) {
      if (method !== 'POST') {
        resolve({ status: false, message: '请求方法错误' });
        return;
      }
    }

    // 如果需要校验用户
    if (rules.includes('user') || rules.includes('admin') || rules.includes('supervision')) {
      // 是否通过用户验证
      verify_result = verify(token, jwt_key, rsa_private_pem);
      if (!verify_result) {
        resolve({ status: false, message: '访问内容需登录' });
        return;
      }
    }

    // 如果需要校验管理员
    if (rules.includes('admin')) {
      let role = verify_result.role;
      if (role != '管理员') {
        resolve({ status: false, message: '无访问权限' });
      }
    }

    // 如果需要校验考核组
    if (rules.includes('supervision')) {
      let role = verify_result.role;
      let user_id = verify_result.user_id;
      if (role == '考核组' || role == '管理员') {
        if (role == '管理员') {
          //   print('管理员');
        } else {
          const listData = await redisEasy(async (redis) => {
            return await redis.lrange('supervision', 0, -1);
          });
          if (listData.filter((e) => e == user_id).length > 0) {
            // print('考核组');
          } else {
            resolve({ status: false, message: '考核组成员，需申请权限' });
            return;
          }
        }
      } else {
        resolve({ status: false, message: '非考核组成员，无访问权限' });
        return;
      }
    }

    resolve({ status: true, message: '通过验证', verify: verify_result });
  });
}

module.exports = {
  rule
};
