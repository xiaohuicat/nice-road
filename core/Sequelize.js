const Sequelize = require('sequelize');
const { getSetting } = require('./setting');

// 全局变量
let sequelize;

/**
 * 创建sequelize
 * @param {Object} 配置参数
 * @return {Object} sequelize实例
 */
function useSequelize() {
  if (sequelize) {
    return sequelize;
  }

  const { database, username, password, host, port, timezone, pool } = getSetting().MYSQL_CONFIG;

  if (!database || !username || !password || !host || !port) {
    throw new Error('database config error');
  }

  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'mysql',
    timezone,
    pool
  });
  return sequelize;
}

/**
 * 同步数据库
 * @return {Object} 同步结果
 */
async function syncSequelize() {
  try {
    await useSequelize().sync();
    return { status: true, msg: '数据库同步成功' };
  } catch (error) {
    return { status: false, msg: error?.message || error };
  }
}

module.exports = {
  useSequelize,
  syncSequelize,
  Sequelize,
  DataTypes: Sequelize.DataTypes,
  Op: Sequelize.Op
};
