/**
 * @module sync
 * @typicalName $fh.sync
 * @memberOf module:fh-mbaas-api
 */

var syncUtil = require('./util');
var metricsModule = require('./sync-metrics');
var _ = require('underscore');
var server = require('./sync-server');
var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var redis = require('redis');
var async = require('async');
var eventEmitter = new (require('events').EventEmitter)();
var debug=syncUtil.debug;

function toJSON(dataset_id, returnData, cb) {
  debug('[%s] toJSON',dataset_id);

  // TODO

  return cb(null, {});
}

/**
 * @external MongoClient
 * @see http://mongodb.github.io/node-mongodb-native/2.1/api/MongoClient.html
 */

/**
 * Make sure the sync server is connected to the required dependent resources, like MongoDB and Redis.
 *
 * NOTE: You don't need to invoke this if you are using the fh-mbaas-api module in your app, it will be called automatically.
 *
 * @alias module:fh-mbaas-api.module:sync.connect
 * @static
 *
 * @param {string} mongodbConnectionString The connection url of MongoDB
 * @param {Object} mongodbConf
 * The MongoDB connection options, see {@link external:MongoClient}
 * As mentioned above, in most cases you don't need to call this function.
 * However, you can still control some of the MongoDB connection options via environment variables
 * @param {number} [mongodbConf.SYNC_MONGODB_POOLSIZE=50] Specify the MongoDB connection pool size,
 * @param {string} redisConnectionString The connection url of Redis. Should include authentication info if required.
 * @param {function} cb the callback function
 * @example
 * var mongodbUrl = "mongodb://mongouser:mongopass@127.0.0.1";
 * var redisUrl = "redis://redisuser:redispass@127.0.0.1";
 *
 * $fh.sync.connect(mongodbUrl, {}, redisUrl, function(err){
 *   if (err) {
 *     console.error('Connection error for sync', err);
 *   } else {
 *     console.log('sync connected');
 *   }
 * });
 */
function connect(mongodbConnectionString, mongodbConf, redisConnectionString, cb) {
  if (arguments.length < 4) throw new Error('connect requires 4 arguments');

  async.series([
    function connectToMongoDB(callback) {
      MongoClient.connect(mongodbConnectionString, mongodbConf || {}, callback);
    },
    function connectToRedis(callback) {
      if (redisConnectionString) {
        var redisOpts = {
          url: redisConnectionString
        };
        var client = redis.createClient(redisOpts);
        return callback(null, client);
      } else {
        return callback();
      }
    }
  ], function(err, results) {
    if (err) return cb(err);
    var mongoDbClient = results[0];
    var redisClient = results[1];

    server.setClients(mongoDbClient, redisClient);

    eventEmitter.emit('sync:ready');
    return cb(null, mongoDbClient, redisClient);
  });
}

function getEventEmitter() {
  debug('getEventEmitter');
  return eventEmitter;
}

function setEventEmitter(emitter) {
  debug('setEventEmitter');
  eventEmitter = emitter;
}

/** @type {Array} Functions that are allowed to be invoked */
var invokeFunctions = ['sync', 'syncRecords', 'listCollisions', 'removeCollision'];

/** Invoke the Sync Server. */
function invoke(dataset_id, params, callback) {
  debug('invoke');

  if (arguments.length < 3) throw new Error('invoke requires 3 arguments');

  // Verify that fn param has been passed
  if (!params || !params.fn) {
    var err = 'no fn parameter provided in params "' + util.inspect(params) + '"';
    debug('[%s] warn %s $j', dataset_id, err, params);
    return callback(err, null);
  }

  var fn = params.fn;

  // Verify that fn param is valid
  if (invokeFunctions.indexOf(fn) < 0) {
    return callback('invalid fn parameter provided in params "' + fn + '"', null);
  }

  var fnHandler =  module.exports[fn] || server[fn] || server.api[fn];

  server.api.start(function(err) {
    if (err) {
      return callback(err);
    }
    return fnHandler(dataset_id, params, callback);
  });
}

// extend from empty object to force copy, and because last source overrides the previous ones
module.exports = _.extend({}, server, {
  sync: metricsModule.timeAsyncFunc(metricsModule.KEYS.SYNC_API_PROCESS_TIME, server.sync),
  syncRecords: metricsModule.timeAsyncFunc(metricsModule.KEYS.SYNC_API_PROCESS_TIME, server.syncRecords),
  listCollisions: metricsModule.timeAsyncFunc(metricsModule.KEYS.SYNC_API_PROCESS_TIME, server.api.listCollisions),
  removeCollision: metricsModule.timeAsyncFunc(metricsModule.KEYS.SYNC_API_PROCESS_TIME, server.api.removeCollision),
  api: _.extend({}, server.api, {
    connect: connect,
    invoke: invoke,
    toJSON: toJSON,
    getEventEmitter: getEventEmitter,
    setEventEmitter: setEventEmitter,
  })
});

//Expose the handler overrides as part of the API. Each key is the name of the public interface, and the value is the name of function in dataHandlers
var handlerOverrides = {
  'globalHandleList': 'globalListHandler',
  'globalHandleCreate': 'globalCreateHandler',
  'globalHandleRead': 'globalReadHandler',
  'globalHandleUpdate': 'globalUpdateHandler',
  'globalHandleDelete': 'globalDeleteHandler',
  'globalHandleCollision': 'globalCollisionHandler',
  'globalListCollisions': 'globalListCollisionsHandler',
  'globalRemoveCollision': 'globalRemoveCollisionHandler',
  'handleList': 'listHandler',
  'handleCreate': 'createHandler',
  'handleRead': 'readHandler',
  'handleUpdate': 'updateHandler',
  'handleDelete': 'deleteHandler',
  'handleCollision': 'collisionHandler',
  'listCollisions': 'listCollisionsHandler',
  'removeCollision': 'removeCollisionHandler'
};

_.each(handlerOverrides, function(target, methodName) {
  module.exports.api[methodName] = function() {
    server.api.callHandler(target, arguments);
  };
});
