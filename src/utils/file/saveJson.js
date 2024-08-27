const fs = require('fs');
const path = require('path');
const { db_url, user_url } = require('../../setting');

function saveJson(db_name, file_name, data) {
  return new Promise((resolve, reject) => {
    var db_name_url = path.join(db_url, db_name);
    var save_path = path.join(db_name_url, `${file_name}.json`);
    if (!fs.existsSync(db_name_url)) {
      fs.mkdirSync(db_name_url);
    }
    // 检查该数据库文件夹是否存在，不存在就创建
    fs.writeFile(save_path, JSON.stringify(data), function (err) {
      resolve(err);
    });
  });
}

function saveUserJson(email, name, data) {
  return new Promise((resolve) => {
    const dir = path.join(user_url, email);
    var save_path = path.join(user_url, `${email}/${name}.json`);
    if (fs.existsSync(dir)) {
      fs.writeFile(save_path, JSON.stringify(data), function (err) {
        resolve(err);
      });
    } else {
      fs.mkdir(dir, (err) => {
        if (err) throw err;
        fs.writeFile(save_path, JSON.stringify(data), function (err) {
          resolve(err);
        });
      });
    }
  });
}

module.exports = {
  saveJson,
  saveUserJson
};
