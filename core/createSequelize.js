const Sequelize = require('sequelize');

let sequelize;

/**
 * 创建sequelize
 * @param {Object} 配置参数
 */
function createSequelize({database, username, password, host, port, timezone}){
  if (sequelize) {
    return sequelize;
  }
  
  sequelize =  new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'mysql',
    timezone,
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    }
  });
  return sequelize;
}

module.exports = {
  createSequelize,
  Sequelize,
}