var proxyquire =  require('proxyquire').noCallThru(),
exec = require('child_process').exec,
redis;

exports.globalSetUp = function(test, assert){
  require('./fixtures/env.js');

  // Start redis & mongo , wait 'till finished then run tests!
  redis = exec("redis-server", function(){});
  test.finish();
};

exports.globalTearDown = function(test, assert){
  redis.kill();
  test.finish();
};