// 抽离成公共方法
const awaitWrap = (promise) => {
  return promise.then((data) => [data, null]).catch((err) => [null, err]);
};

module.exports = { awaitWrap };
