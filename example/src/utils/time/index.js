function nowTXT() {
  var date = new Date();
  return date.toLocaleString() + date.getMilliseconds();
}

function db_time(time_s) {
  var date = time_s
    ? new Date(+new Date(time_s) + 8 * 3600 * 1000)
    : new Date(+new Date() + 8 * 3600 * 1000);
  return date.toISOString().slice(0, 19).replace('T', ' ') + '.' + date.getMilliseconds();
}
function db_time_raw(time_s) {
  var date = time_s ? new Date(+new Date(time_s)) : new Date(+new Date());
  return date.toISOString().slice(0, 19).replace('T', ' ') + '.' + date.getMilliseconds();
}

function dateTimeZone8() {
  var timezone = 8; //目标时区时间，东八区
  var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
  var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
  var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
  return targetDate;
}

function secondToDate(second) {
  // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
  var date = new Date(second);
  Y = date.getFullYear();
  M = date.getMonth() + 1;
  D = date.getDate();
  h = date.getHours();
  m = date.getMinutes();
  s = date.getSeconds();

  if (M < 10) {
    M = `0${M}`;
  }
  if (D < 10) {
    D = `0${D}`;
  }
  if (h < 10) {
    h = `0${h}`;
  }
  if (m < 10) {
    m = `0${m}`;
  }
  if (s < 10) {
    s = `0${s}`;
  }

  var time = `${Y}-${M}-${D} ${h}:${m}:${s}`; //呀麻碟
  // 输出结果：2014-04-23 18:55:49
  return time;
}

module.exports = {
  nowTXT,
  db_time,
  db_time_raw,
  dateTimeZone8,
  secondToDate,
};
