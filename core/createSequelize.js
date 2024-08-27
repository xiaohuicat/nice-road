const Sequelize = require('sequelize');

let sequelize;

/**
 * 创建sequelize
 * @param {Object} mysql_config
 */
function createSequelize(mysql_config){
  if (sequelize) {
    return sequelize;
  }
  
  sequelize =  new Sequelize(mysql_config.database, mysql_config.username, mysql_config.password, {
    host: mysql_config.host,
    port: mysql_config.port,
    dialect: 'mysql',
    timezone: mysql_config.timezone,
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