const setting = require('./setting');
const { NiceRoad } = require('./dist/nice-road');
const road = new NiceRoad(setting);
road.initRouter('./src/router');
road.run(8080);
