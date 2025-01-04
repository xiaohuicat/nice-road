/**
 * 校验下一个
 * @param {*} msg 错误消息
 * @param {*} params 参数
 * @return {fail: false, msg: '', params: []}
 */
function createResult(fail, msg, params) {
  return { fail, msg: msg || '', params: params || [] };
}

/**
 * 多条件校验，返回true
 * @param {Array} conditions 条件数组
 * @return {fail: false, msg: *} 校验结果
 */
function multipleValidate(conditions) {
  if (!Array.isArray(conditions)) {
    throw new Error('conditions参数必须为数组');
  }

  let innerParams = [];

  for (const each of conditions) {
    let isFail = false;
    let errorMsg = '';
    let params = [];

    if (typeof each === 'function') {
      // 函数类型条件
      const result = each(innerParams);
      isFail = result.fail;
      errorMsg = result.msg;
      params = result.params;
    } else if (Array.isArray(each) && each.length === 2) {
      // [isFail, errorMsg] 格式
      [isFail, errorMsg] = each;
    } else if (each && typeof each === 'object') {
      // { fail, msg, params } 格式
      isFail = each.fail;
      errorMsg = each.msg;
      params = each.params;
    }

    // 如果校验失败，立即返回
    if (isFail) {
      return breakValid(errorMsg, params);
    }

    // 更新 innerParams
    innerParams = params;
  }

  // 所有校验通过
  return nextValid('pass', innerParams);
}

/**
 * 校验通过
 * @param {*} args 参数
 * @return {fail: false, msg: '', params: []}
 */
function nextValid(msg, ...args) {
  return createResult(false, msg, args);
}

/**
 * 跳出校验
 * @param msg 原因
 * @param params 参数
 * @returns {fail: true, msg: *, params: []}
 */
function breakValid(msg, ...args) {
  return createResult(true, msg, args);
}

module.exports = {
  breakValid,
  nextValid,
  multipleValidate,
};
