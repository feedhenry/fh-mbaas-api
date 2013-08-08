var proxyquire =  require('proxyquire').noCallThru(),
exec = require('child_process').exec,
application, redis, mongod,
feedMock;

exports.globalSetUp = function(test, assert){
  feedMock = require('./fixtures/feed'); // needs to go here, as application.js is what requires fh-apis
  require('./fixtures/env.js');
  application = require('./fixtures/application.js');

  // Start redis & mongo , wait 'till finished then run tests!
  redis = exec("redis-server", function(){});
  test.finish();
};

exports.globalTearDown = function(test, assert){
  feedMock.done();
  application.close();
  redis.kill();
  test.finish();
};