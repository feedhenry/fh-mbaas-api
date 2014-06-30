var proxyquire =  require('proxyquire').noCallThru(),
exec = require('child_process').exec,
redis;

exports.setUp = function(finish){
  require('./fixtures/env.js');

  // Start redis & mongo , wait 'till finished then run tests!
  redis = exec("redis-server", function(){});
  finish();
};

exports.tearDown = function(finish){
  redis.kill();
  finish();
};