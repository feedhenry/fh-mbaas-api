var redis = require("redis"),
redisPort = 6379,
redisHost = '127.0.0.1',
redisPassword = '',
redisClient, appname, logger;

// Redis local settings, overridden in init if we're running in CloudFoundry/DynoFarm
module.exports = function(cfg){
  if (!cfg){
    return;
  }

  logger = cfg.logger;
  appname = cfg.fhapi.appname;

  // DynoFarm overrides
  if (cfg && cfg.redis) {
    if (cfg.redis.host) redisHost = cfg.redis.host;
    if (cfg.redis.port) redisPort = cfg.redis.port;
    if (cfg.redis.password) redisPassword = cfg.redis.password;
  }

  if (process.env.VCAP_SERVICES) {
    var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    if (vcapServices != undefined && vcapServices != null && (vcapServices['redis-2.2'] != undefined || vcapServices['redis'] != undefined)){
      var cfRedis = (vcapServices['redis-2.2']  || vcapServices['redis'])[0];
      redisHost = cfRedis.credentials.hostname;
      redisPort = cfRedis.credentials.port;
      redisPassword = cfRedis.credentials.password;
      logger.info('Binding to redis: ' + redisHost + ":" + redisPort);
    }else {
      logger.warning("In CloudFoundry environment but no Redis Service specified");
    }
  }
  // redisClient function
  redisClient = function() {
    var client = redis.createClient(redisPort, redisHost);
    if (process.env.VCAP_SERVICES) {
      client.auth(redisPassword);
    }
    return client;
  };

  return cache;
}





//
// $fhserver.cache() is undocumented publically, but it have the following 'interface':
// opts.act: can be one of 'save/load/remove'
// opts.key: the key
// opts.value: the value
// opts.expire: the cache expiry value
//
// See WidgetMemcacheBean in millicore for more info.
//
var cache = function(opts, callback) {
  if (callback == undefined) {
    throw new Error('callback undefined in $fh.cache. See documentation of $fh.cache for proper usage');
  }

  if (opts.act == undefined){
    return callback('No cache actions defined!');
  }

  var fullKey = appname + opts.key;

  if (opts.act == 'save') {
    var client = redisClient();
    client.on("connect", function () {
      if (process.env.VCAP_SERVICES) {
        client.auth(redisPassword, function(err, res) {
          if (err) callback(err);
        });
      }
    });
    client.on("error", function (err) {
      return callback(err);
    });
    client.on("ready", function (err) {
      if (err) return callback(err);
      if (opts.expire != undefined) {
        client.setex(fullKey, opts.expire, opts.value, function (err, reply) {
          client.quit();
          return callback(err, reply);
        });
      }else {
        client.set(fullKey, opts.value, function (err, reply) {
          client.quit();
          return callback(err, reply);
        });
      }
    });
  }else if (opts.act == 'load') {
    var client = redisClient();
    client.on("connect", function () {
      if (process.env.VCAP_SERVICES) {
        client.auth(redisPassword, function(err, res) {
          if (err) callback(err);
        });
      }
    });
    client.on("error", function (err) {
      callback(err);
      client.end();
    });
    client.on("ready", function (err) {
      if (err) return callback(err);
      client.get(fullKey, function(err, reply) {
        client.quit();
        return callback(err, reply);
      });
    });
  }else if (opts.act == 'remove') {
    var client = redisClient();
    client.on("connect", function () {
      if (process.env.VCAP_SERVICES) {
        client.auth(redisPassword, function(err, res) {
          if (err) callback(err);
        });
      }
    });
    client.on("error", function (err) {
      return callback(err);
    });
    client.on("ready", function (err) {
      if (err) return callback(err);
      client.del(fullKey, function(err, reply) {
        client.quit();
        return callback(err, reply);
      });
    });
  }else {
    return callback("Unknown cache action: " + opts.act);
  }
};