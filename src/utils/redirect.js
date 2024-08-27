var path = require('path');
const { getPathName } = require('../core/getReqUrl');

function fullPathRedirect(request, response) {
  var pathName = getPathName(request);
  var style = 'http';
  //解决301重定向问题，如果pathname没以/结尾，并且没有扩展名
  if (!pathName.endsWith('/') && path.extname(pathName) === '') {
    pathName += '/';
    var redirect = `${style}://` + request.headers.host + pathName;
    response.writeHead(302, {
      location: redirect
    });
    response.end();
  }
}

// type填301或302，即永久和暂时
function redirect(response, type, url) {
  response.writeHead(type, { location: url });
  response.end();
}

module.exports = {
  fullPathRedirect,
  redirect
};
