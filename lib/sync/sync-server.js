var metricsModule = require('./sync-metrics');
var ackProcessor = require('./ack-processor');
var async = require('async');
var dataHandlersModule = require('./dataHandlers');
var datasets = require('./datasets');
var defaultDataHandlersModule = require('./default-dataHandlers');
var hashProviderModule = require('./hashProvider');
var interceptorsModule = require('./interceptors');
var MongodbQueue = require('./mongodbQueue');
var pendingProcessor = require('./pending-processor');
var storageModule = require('./storage');
var syncApiModule = require('./api-sync');
var syncLockModule = require('./lock');
var syncProcessor = require('./sync-processor');
var syncRecordsApiModule = require('./api-syncRecords');
var syncSchedulerModule = require('./sync-scheduler');
var cacheClientModule = require('./sync-cache');
var syncUtil = require('./util');
var datasetClientCleanerModule = require('./datasetClientsCleaner');
var debug = syncUtil.debug;
var Worker = require('./worker');
var _ = require('underscore');

var redisClient = null;
var mongoDbClient = null;
var metricsClient = null;
var hashProvider = null;
var syncLock = null;
var syncScheduler = null;
var syncStorage = null;
var interceptors = null;
var apiSync = null;
var apiSyncRecords = null;
var dataHandlers = null;
var cacheClient = null;
var datasetClientCleaner = null;

var ackQueue;
var pendingQueue;
var syncQueue;

var ackWorkers = [];
var pendingWorkers = [];
var syncWorkers = [];

/** @type {Object} default global configuration options for the sync server */
var DEFAULT_SYNC_CONF = {
  /** @type {Number} how often pending workers should check for the next job, in ms. Default: 1 */
  pendingWorkerInterval: 1,
  /** @type {Number} the concurrency value of the pending workers. Default is 1. Can set to 0 to disable the pendingWorkers completely */
  pendingWorkerConcurrency: 1,
  /** @type {Object} the backoff strategy for the pending worker to use. 
   * Default strategy is `exp` (exponential) with a max delay of 60s. The min value will always be the same as `pendingWorkerInterval`
   * The other valid strategy is `fib` (fibonacci). Set it to anything else will disable the backoff behavior */
  pendingWorkerBackoff: {strategy: 'exp', max: 60*1000},
  /** @type {Number} how often ack workers should check for the next job, in ms. Default: 1 */
  ackWorkerInterval: 1,
  /** @type {Number} the concurrency value of the ack workers. Default is 1. Can set to 0 to disable the ackWorker completely */
  ackWorkerConcurrency: 1,
  /** @type {Object} the backoff strategy for the ack worker to use. 
   * Default strategy is `exp` (exponential) with a max delay of 60s. The min value will always be the same as `ackWorkerInterval`
   * The other valid strategy is `fib` (fibonacci). Set it to anything else will disable the backoff behavior  */
  ackWorkerBackoff: {strategy: 'exp', max: 60*1000},
  /** @type {Number} how often sync workers should check for the next job, in ms. Default: 100 */
  syncWorkerInterval: 100,
  /** @type {Number} the concurrency value of the sync workers. Default is 1. Can set to 0 to disable the syncWorker completely. */
  syncWorkerConcurrency: 1,
  /** @type {Object} the backoff strategy for the sync worker to use. 
   * Default strategy is `none`, which means it's turned off for the sync worker.
   * This is to ensure when there is a sync request on the queue, it will be processed as soon as possible.
   * The backoff could delay the process of the request significantly.
   * Other valid strategies are `exp` (exponential) and `fib` (fibonacci).*/
  syncWorkerBackoff: {strategy: 'none'},
  /** @type {Number} how often the scheduler should check the datasetClients, in ms. Default: 500 */
  schedulerInterval: 500,
  /** @type {Number} the max time a scheduler can hold the lock for, in ms. Default: 20000 */
  schedulerLockMaxTime: 20000,
  /** @type {String} the default lock name for the sync scheduler */
  schedulerLockName: 'locks:sync:SyncScheduler',
  /**@type {Number} the default concurrency value when update dataset clients in the sync API. Default is 10. In most case this value should not need to be changed */
  datasetClientUpdateConcurrency: 10,
  /**@type {Boolean} enable/disable collect sync stats to allow query via an endpoint */
  collectStats: true,
  /**@type {Number} the number of records to keep in order to compute the stats data. Default is 1000. */
  statsRecordsToKeep: 1000,
  /**@type {Number} how often the stats should be collected. In milliseconds. */
  collectStatsInterval: 5000,
  /**@type {String} the host of the influxdb server. If set, the metrics data will be sent to the influxdb server. */
  metricsInfluxdbHost: null,
  /**@type {Number} the port of the influxdb server. It should be a UDP port. */
  metricsInfluxdbPort: null,
  /**@type {Boolean} if cache the dataset client records using redis. This can help improve performance for the syncRecords API.
   * Can be turned on if there are no records are shared between many different dataset clients. Default is false.
  */
  useCache: false,
  /**@type {Object} specify how many messages to keep for the queues. By default it will keep the messages in the last 24 hours */
  queueMessagesToKeep: {time: '24h'},
  /**@type {Number} specify how often the queues should be checked to prune old message. By default it will run every hour. */
  queuePruneFrequency: 1*60*60*1000,
  /**@type {String} specify the maximum retention time of an inactive datasetClient. Any inactive datasetClient that is older than this period of time will be removed.*/
  datasetClientCleanerRetentionPeriod: '24h',
  /** @type {String} specify the frequency the datasetClient cleaner should run. Default every hour.*/
  datasetClientCleanerCheckFrequency: '1h'
};
var syncConfig = _.extend({}, DEFAULT_SYNC_CONF);
var syncStarted = false;

/** Initialise cloud data sync service for specified dataset. */
function init(dataset_id, options, cb) {
  debug('[%s] init sync with options %j', dataset_id, options);
  datasets.init(dataset_id, options);
  start(function(err) {
    if (err) {
      return cb(err);
    }
    syncStorage.updateManyDatasetClients({datasetId: dataset_id}, {stopped: false}, cb);
  });
}

function setClients(mongo, redis) {
  mongoDbClient = mongo;
  redisClient = redis;
  dataHandlers = dataHandlersModule({
    defaultHandlers: defaultDataHandlersModule(mongoDbClient)
  });
  cacheClient = cacheClientModule(syncConfig, redisClient);
  syncStorage = storageModule(mongoDbClient, cacheClient);
  // TODO: follow same pattern as other modules for this hashProviderModule
  hashProvider = hashProviderModule;
  syncLock = syncLockModule(mongoDbClient, 'fhsync_locks');
  interceptors = interceptorsModule();
}

function startAllWorkers(workers) {
  workers.forEach(function(worker){
    worker.work();
  });
}

function stopAllWorkers(workers, cb) {
  async.each(workers, function(worker, callback) {
    worker.stop.call(worker, callback);
  }, cb);
}

/**
 * Starts all sync queues, workers & the sync scheduler.
 * This should only be called after `connect()`.
 * If this is not explicitly called before clients send sync requests,
 * it will be called when a client sends a sync request.
 * It is OK for this to be called multiple times.
 *
 * @param {function} cb
 */
function start(cb) {
  if (arguments.length < 1) throw new Error('start requires 1 argument');

  if (syncStarted) return cb();

  if (mongoDbClient === null || redisClient === null) {
    return cb('MongoDB Client & Redis Client are not connected. Ensure connect() is called before calling start');
  }

  metricsClient = metricsModule.init(syncConfig, redisClient);

  async.series([
    function createQueues(callback) {
      ackQueue = new MongodbQueue('fhsync_ack_queue', metricsClient, {mongodb: mongoDbClient, messagesToKeep: syncConfig.queueMessagesToKeep, pruneFrequency: syncConfig.queuePruneFrequency});
      pendingQueue = new MongodbQueue('fhsync_pending_queue', metricsClient, {mongodb: mongoDbClient, messagesToKeep: syncConfig.queueMessagesToKeep, pruneFrequency: syncConfig.queuePruneFrequency});
      syncQueue = new MongodbQueue('fhsync_queue', metricsClient, {mongodb: mongoDbClient, messagesToKeep: syncConfig.queueMessagesToKeep, pruneFrequency: syncConfig.queuePruneFrequency});

      async.parallel([
        async.apply(ackQueue.create.bind(ackQueue)),
        async.apply(ackQueue.startPruneJob.bind(ackQueue), true),
        async.apply(pendingQueue.create.bind(pendingQueue)),
        async.apply(pendingQueue.startPruneJob.bind(pendingQueue), true),
        async.apply(syncQueue.create.bind(syncQueue)),
        async.apply(syncQueue.startPruneJob.bind(syncQueue), true),
      ], callback);
    },
    function initApis(callback) {
      apiSync = syncApiModule(interceptors, ackQueue, pendingQueue, syncStorage, syncConfig);
      apiSyncRecords = syncRecordsApiModule(syncStorage, pendingQueue);
      return callback();
    },
    function createWorkers(callback) {
      var syncProcessorImpl = syncProcessor(syncStorage, dataHandlers, metricsClient, hashProvider);
      var syncWorkerOpts = {
        name: 'sync_worker',
        interval: syncConfig.syncWorkerInterval,
        backoff: syncConfig.syncWorkerBackoff,
        collectStatsInterval: syncConfig.collectStatsInterval
      };
      for (var i = 0; i < syncConfig.syncWorkerConcurrency; i++) {
        var syncWorker = new Worker(syncQueue, syncProcessorImpl, metricsClient, syncWorkerOpts);
        syncWorkers.push(syncWorker);
      }

      var ackProcessorImpl = ackProcessor(syncStorage);
      var ackWorkerOpts = {
        name: 'ack_worker',
        interval: syncConfig.ackWorkerInterval,
        backoff: syncConfig.ackWorkerBackoff,
        collectStatsInterval: syncConfig.collectStatsInterval
      };
      for (var j = 0; j < syncConfig.ackWorkerConcurrency; j++) {
        var ackWorker = new Worker(ackQueue, ackProcessorImpl, metricsClient, ackWorkerOpts);
        ackWorkers.push(ackWorker);
      }

      var pendingProcessorImpl = pendingProcessor(syncStorage, dataHandlers, hashProvider, metricsClient);
      var pendingWorkerOpts = {
        name: 'pending_worker',
        interval: syncConfig.pendingWorkerInterval,
        backoff: syncConfig.pendingWorkerBackoff,
        collectStatsInterval: syncConfig.collectStatsInterval
      };
      for (var k = 0; k < syncConfig.pendingWorkerConcurrency; k++) {
        var pendingWorker = new Worker(pendingQueue, pendingProcessorImpl, metricsClient, pendingWorkerOpts);
        pendingWorkers.push(pendingWorker);
      }

      startAllWorkers(syncWorkers);
      startAllWorkers(ackWorkers);
      startAllWorkers(pendingWorkers);

      return callback();
    },
    function startSyncScheduler(callback) {
      var SyncScheduler = syncSchedulerModule(syncLock, syncStorage, metricsClient).SyncScheduler;
      syncScheduler = new SyncScheduler(syncQueue, {timeBetweenChecks: syncConfig.schedulerInterval, timeBeforeCrashAssumed: syncConfig.schedulerLockMaxTime, syncSchedulerLockName: syncConfig.schedulerLockName});
      syncScheduler.start();
      return callback();
    },
    function startDatasetClientCleaner(callback) {
      var datasetClientCleanerBuilder = datasetClientCleanerModule(syncStorage);
      datasetClientCleaner = datasetClientCleanerBuilder({retentionPeriod: syncConfig.datasetClientCleanerRetentionPeriod, checkFrequency: syncConfig.datasetClientCleanerCheckFrequency});
      datasetClientCleaner.start(true, callback);
    }
  ], function(err) {
    if (err) return cb(err);
    syncStarted = true;
    return cb();
  });
}

function sync(datasetId, params, cb) {
  apiSync(datasetId, params, cb);
}

function syncRecords(datasetId, params, cb) {
  apiSyncRecords(datasetId, params, cb);
}

/** Stop cloud data sync for the specified dataset_id */
function stop(dataset_id, cb) {
  if (!syncStarted) {
    return cb();
  }
  debug('[%s] stop sync for dataset', dataset_id);
  syncStorage.updateManyDatasetClients({datasetId: dataset_id}, {stopped: true}, cb);
}

function setConfig(conf) {
  //make sure extend the existing syncConfig object so that we don't have to update other modules which might have references to it.
  //if we use new object here then we have to manually update those modules to reflect the change.
  syncConfig = _.extend(syncConfig || {}, DEFAULT_SYNC_CONF, conf);
}

/**
 * Stop cloud data sync service for ALL datasets and reset.
 * This should really only used by tests.
 */
function stopAll(cb) {
  //sync is not started yet, but connect could be called already. In this case, just reset a few things
  if (!syncStarted) {
    mongoDbClient = null;
    redisClient = null;
    metricsClient = null;
    return cb();
  }
  debug('stopAll syncs');
  ackQueue.stopPruneJob();
  pendingQueue.stopPruneJob();
  syncQueue.stopPruneJob();
  datasetClientCleaner.stop();
  async.parallel([
    async.apply(syncStorage.updateManyDatasetClients, {}, {stopped: true}),
    async.apply(stopAllWorkers, syncWorkers),
    async.apply(stopAllWorkers, ackWorkers),
    async.apply(stopAllWorkers, pendingWorkers),
    async.apply(syncScheduler.stop.bind(syncScheduler))
  ], function(err) {
    if (err) {
      debug('Failed to stop sync due to error : %j', err);
      return cb(err);
    }
    setConfig();
    dataHandlers.restore();
    interceptors.restore();
    mongoDbClient = null;
    redisClient = null;
    metricsClient = null;
    ackQueue = null;
    pendingQueue = null;
    syncQueue = null;
    ackWorkers = [];
    pendingWorkers = [];
    syncWorkers = [];
    syncStarted = false;
    dataHandlers = null;
    interceptors = null;
    hashProvider = null;
    syncLock = null;
    datasetClientCleaner = null;
    return cb();
  });
}

function globalInterceptRequest(fn) {
  interceptors.setDefaultRequestInterceptor(fn);
}
function globalInterceptResponse(fn) {
  interceptors.setDefaultResponseInterceptor(fn);
}
function interceptRequest(datasetId, fn) {
  interceptors.setRequestInterceptor(datasetId, fn);
}
function interceptResponse(datasetId, fn) {
  interceptors.setResponseInterceptor(datasetId, fn);
}

function listCollisions(datasetId, params, cb) {
  debug('[%s] listCollisions', datasetId);
  dataHandlers.listCollisions(datasetId, params.meta_data, cb);
}

/**
 * Defines a handler function for deleting a collision from the collisions list.
 * Should be called after the dataset is initialised.
 */
function removeCollision(datasetId, params, cb) {
  debug('[%s] removeCollision');
  dataHandlers.removeCollision(datasetId, params.hash, params.meta_data, cb);
}

function callHandler(handlerName, args) {
  dataHandlers[handlerName].apply(null, args);
}

function getStats(cb) {
  metricsModule.getStats(cb);
}

module.exports = {
  sync: sync,
  syncRecords: syncRecords,
  setClients: setClients,
  api: {
    init: init,
    start: start,
    stop: stop,
    stopAll: stopAll,
    setConfig: setConfig,
    globalInterceptRequest: globalInterceptRequest,
    globalInterceptResponse: globalInterceptResponse,
    interceptRequest: interceptRequest,
    interceptResponse: interceptResponse,
    listCollisions: listCollisions,
    removeCollision: removeCollision,
    callHandler: callHandler,
    getStats: getStats,
    setRecordHashFn: hashProviderModule.setRecordHashFn,
    setGlobalHashFn: hashProviderModule.setGlobalHashFn
  }
};