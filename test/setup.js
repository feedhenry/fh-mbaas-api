var proxyquire =  require('proxyquire').noCallThru(),
exec = require('child_process').exec,
application, redis, mongod;

exports.globalSetUp = function(test, assert){
  require('./fixtures/env.js');
  application = require('./fixtures/application.js');

  // Start redis & mongo , wait 'till finished then run tests!
  redis = exec("redis-server", function(){});
  mongod = exec("mongod", function(){});
  test.finish();
};

exports.globalTearDown = function(test, assert){
  application.close();
  redis.kill();
  mongod.kill();
  test.finish();
};