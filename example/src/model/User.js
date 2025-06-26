const { useSequelize, Sequelize } = require('nice-road');

//用户模型
var User = useSequelize().define(
  'users',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
    },
    user_id: Sequelize.BIGINT(20),
    hash: Sequelize.STRING(100),
    salt: Sequelize.STRING(32),
    email: Sequelize.STRING(50),
    gender: Sequelize.INTEGER(10),
    name: Sequelize.STRING(100),
    avatarUrl: Sequelize.STRING(50),
    label: Sequelize.JSON,
    birthday: Sequelize.DATEONLY,
    create_at: Sequelize.BIGINT,
    update_at: Sequelize.BIGINT,
  },
  { timestamps: false, freezeTableName: true },
);

module.exports = {
  User,
};
