function getFileNameByPath(path) {
  var index = path.lastIndexOf('\\'); // lastIndexOf("/")  找到最后一个  /  的位置
  var fileName = path.substr(index + 1); // substr() 截取剩余的字符，即得文件名xxx.doc
  return fileName;
}
module.exports = {
  getFileNameByPath
};
