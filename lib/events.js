var mbaasClient = require('fh-mbaas-client');
var assert = require('assert');
var config;
var logger;

var create = function(options, cb){
  mbaasClient.app.events.create({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain
  }, cb);
};

module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  config = cfg;
  logger = cfg.logger;
  return {
    create: create
  };
};