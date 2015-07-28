var proxyquire = require('proxyquire').noCallThru();

var util = require('util');
var async = require('async');
var assert = require('assert');

var mockCfg = {
  logger: null,
  fhapi: {
    appname: 'testapp'
  },
  redis: {
    host: 'redishost',
    port: '1234',
    password: 'mysecret'
  }
};

var mockClient = {
  on: function() {},
  auth: function(pass) {
    assert.equal(mockCfg.redis.password, pass);
  }
};

var mockRedis = {
  createClient: function(testPort, testHost) {
    // check that we're trying to connect with the configured host/port params
    assert.equal(parseInt(mockCfg.redis.port), testPort);
    assert.equal(mockCfg.redis.host, testHost);
    return mockClient;
  }
}

var cache = proxyquire('../lib/cache.js', {'redis' : mockRedis}) (mockCfg);

module.exports = {
  'test cache setup when specifying port': function(finish) {
    // This just tests that the configured host/port and password are sent through to the redis module
    cache({'act': 'load', 'key': "mykey"}, function (err, value) {
    });
    finish();
  }
};
