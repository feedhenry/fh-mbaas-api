var crypto = require('crypto');
var async = require('async');
var assert = require('assert');
var winston = require('winston');
var moment = require('moment');
var util = require('util');
var sync = {},
db;

var SYNC_LOGGER = 'SYNC';



sync.init = function(dataset_id, options, cb) {
  initDataset(dataset_id, options, cb);
};

sync.invoke = function(dataset_id, params, callback) {
  return doInvoke(dataset_id, params, callback);
};

sync.stop = function(dataset_id, callback) {
  return stopDatasetSync(dataset_id, callback);
};

sync.stopAll = function(callback) {
  return stopAllDatasetSync(callback);
};

sync.handleList = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.listHandler = fn;
    }
  });
};

sync.handleCreate = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.createHandler = fn;
    }
  });
};

sync.handleRead = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.readHandler = fn;
    }
  });
};

sync.handleUpdate = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.updateHandler = fn;
    }
  });
};

sync.handleDelete = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.deleteHandler = fn;
    }
  });
};

sync.handleCollision = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.collisionHandler = fn;
    }
  });
};

sync.listCollisions = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.collisionLister = fn;
    }
  });
};

sync.removeCollision = function(dataset_id, fn) {
  getDataset(dataset_id, function(err, dataset) {
    if( ! err ) {
      dataset.collisionRemover = fn;
    }
  });
};

/* ======================================================= */
/* ================== PRIVATE FUNCTIONS ================== */
/* ======================================================= */

function initDataset(dataset_id, options, cb) {
  doLog(SYNC_LOGGER, 'info', 'initDataset - ' + dataset_id);
  var datasetConfig = JSON.parse(JSON.stringify(defaults));
  for (var i in options) {
    datasetConfig[i] = options[i];
  }

  setLogger(dataset_id, datasetConfig);

  createDataset(dataset_id, function(err, dataset) {
    if( err ) {
      return cb(err, null);
    }
    dataset.config = datasetConfig;
    cb(null, {});
  });
}

function stopDatasetSync(dataset_id, cb) {
  doLog(dataset_id, 'info', 'stopDatasetSync');
  getDataset(dataset_id, function(err, dataset) {
    if( err ) {
      return cb(err);
    }

    if( dataset.timeouts ) {
      for(var i in dataset.timeouts ) {
        clearTimeout(dataset.timeouts[i]);
      }
    }

    removeDataset(dataset_id, cb);
  });
}

function stopAllDatasetSync(cb) {
  doLog(SYNC_LOGGER, 'info', 'stopAllDatasetSync');

  var stoppingDatasets = [];
  for( var dsId in datasets ) {
    if( datasets.hasOwnProperty(dsId) ) {
      stoppingDatasets.push(datasets[dsId]);
    }
  }

  var stoppedDatasets = [];

  async.forEachSeries(stoppingDatasets, function(dataset, itemCallback) {
    stoppedDatasets.push(dataset.id);
    stopDatasetSync(dataset.id, itemCallback);
  },
  function(err) {
    cb(err, stoppedDatasets);
  });
}

function doInvoke(dataset_id, params, callback) {

  // Verify that fn param has been passed
  if( ! params || ! params.fn ) {
    doLog(dataset_id, 'warn', 'no fn parameter provided :: ' + util.inspect(params), params);
    return callback("no_fn", null);
  }

  var fn = params.fn;

  // Verify that fn param is valid
  var fnHandler = invokeFunctions[fn];
  if( ! fnHandler ) {
    return callback("unknown_fn : " + fn, null);
  }

  return fnHandler(dataset_id, params, callback);
}

function doListCollisions(dataset_id, params, cb) {
  getDataset(dataset_id, function(err, dataset) {
    if( err ) return cb(err);

    if( ! dataset.collisionLister ) {
      return cb("no_collisionLister", null);
    }

    dataset.collisionLister(dataset_id, cb);
  });
}

function doRemoveCollision(dataset_id, params, cb) {
  getDataset(dataset_id, function(err, dataset) {
    if( err ) return cb(err);

    if( ! dataset.collisionRemover ) {
      return cb("no_collisionRemover", null);
    }

    dataset.collisionRemover(dataset_id, params.hash, cb);
  });
}

function doSetLogLevel(dataset_id, params, cb) {
  if( params && params.logLevel) {
    doLog(dataset_id, 'info', 'Setting logLevel to "' + params.logLevel +'"');
    setLogger(dataset_id, params);
    cb(null, {"status":"ok"});
  }
  else {
    cb('logLevel parameter required');
  }
}

function doClientSync(dataset_id, params, callback) {

  // Verify that query_param have been passed
  if( ! params || ! params.query_params ) {
    return callback("no_query_params", null);
  }

  getDataset(dataset_id, function(err, dataset) {
    if( err ) {
      return callback(err, null);
    }
    if( ! dataset.listHandler ) {
      return callback("no_listHandler", null);
    }


    //Deal with any Acknowledgement of updates from the client
    acknowledgeUpdates(dataset_id, params, function(err) {

      if( params.pending && params.pending.length > 0) {
        doLog(dataset_id, 'info', 'Found ' + params.pending.length + ' pending records. processing', params);

        // Process Pending Params then re-sync data
        processPending(dataset_id, dataset, params, function() {
          doLog(dataset_id, 'verbose', 'back from processPending', params);
          // Changes have been submitted from client, redo the list operation on back end system,
          redoSyncList(dataset_id, params.query_params, function(err, res) {
            returnUpdates(dataset_id, params, res, callback);
          });
        });
      }
      else {
        // No pending updates, just sync client dataset
        var queryHash = generateHash(params.query_params);
        if( dataset.syncLists[queryHash] ) {
          doLog(dataset_id, 'verbose', 'doClientSync - No pending - Hash (Client :: Cloud) = ' + params.dataset_hash + ' :: ' + dataset.syncLists[queryHash].hash, params);

          if( dataset.syncLists[queryHash].hash === params.dataset_hash) {
            doLog(dataset_id, 'verbose', 'doClientSync - No pending - Hashes match. Just return hash');
            var res = {"hash": dataset.syncLists[queryHash].hash};
            returnUpdates(dataset_id, params, res, callback);
          }
          else {
            doLog(dataset_id, 'info', 'doClientSync - No pending - Hashes NO NOT match (Client :: Cloud) = ' + params.dataset_hash + ' :: ' + dataset.syncLists[queryHash].hash + ' - return full dataset', params);
            var res = dataset.syncLists[queryHash];
            returnUpdates(dataset_id, params, res, callback);
          }
        } else {
          doLog(dataset_id, 'verbose', 'No pending records. No cloud data set - invoking list on back end system', params);
          redoSyncList(dataset_id, params.query_params, function(err, res) {
            if( err ) callback(err);
            returnUpdates(dataset_id, params, res, callback);
          });
        }
      }
    });
  });
}

function processPending(dataset_id, dataset, params, cb) {
  var pending = params.pending;

  var cuid = getCuid(params);

  var itemCallback = function(err, update) {
    doLog(dataset_id, 'verbose', 'itemCallback :: err=' + err + " :: storedPendingUpdate = " + util.inspect(update), params);
  }

  doLog(dataset_id, 'verbose', 'processPending :: starting async.forEachSeries');
  async.forEachSeries(pending, function(pendingObj, itemCallback) {
    //var pendingObj = pending[i];
    doLog(dataset_id, 'silly', 'processPending :: item = ' + util.inspect(pendingObj), params);
    var action = pendingObj.action;
    var uid = pendingObj.uid;
    var pre = pendingObj.pre;
    var post = pendingObj.post;
    var hash = pendingObj.hash;
    var timestamp = pendingObj.timestamp;

    function addUpdate(type, action, hash, uid, msg, cb) {

      var update = {
        cuid: cuid,
        type: type,
        action: action,
        hash: hash,
        uid : uid,
        msg: util.inspect(msg)
      }
      db({
        "act": "create",
        "type": dataset_id + "-updates",
        "fields": update
      }, function(err, res) {
        cb(err, res);
      });
    }

    if( "create" === action ) {
      doLog(dataset_id, 'info', 'CREATE Start', params);
      dataset.createHandler(dataset_id, post, function(err, data) {
        if( err ) {
          doLog(dataset_id, 'warn', 'CREATE Failed - uid=' + uid + ' : err = ' + err, params);
          return addUpdate("failed", "create", hash, uid, err, itemCallback);
        }
        doLog(dataset_id, 'info', 'CREATE Success - uid=' + data.uid + ' : hash = ' + hash, params);
        return addUpdate("applied", "create", hash, data.uid, '', itemCallback);
      });
    }
    else if ( "update" === action ) {
      doLog(dataset_id, 'info', 'UPDATE Start', params);
      dataset.readHandler(dataset_id, uid, function(err, data) {
        if( err ) {
          doLog(dataset_id, 'warn', 'READ for UPDATE Failed - uid=' + uid + ' : err = ' + err, params);
          return addUpdate("failed", "update", hash, uid, err, itemCallback);
        }
        doLog(dataset_id, 'info', ' READ for UPDATE Success', params);
        doLog(dataset_id, 'silly', 'READ for UPDATE Data : \n' + util.inspect(data), params);

        var preHash = generateHash(pre);
        var dataHash = generateHash(data);

        doLog(dataset_id, 'info', 'UPDATE Hash Check ' + uid + ' (client :: dataStore) = ' + preHash + ' :: ' + dataHash, params);

        if( preHash === dataHash ) {
          dataset.updateHandler(dataset_id, uid, post, function(err, data) {
            if( err ) {
              doLog(dataset_id, 'warn', 'UPDATE Failed - uid=' + uid + ' : err = ' + err, params);
              return addUpdate("failed", "update", hash, uid, err, itemCallback);
            }
            doLog(dataset_id, 'info', 'UPDATE Success - uid=' + uid + ' : hash = ' + hash, params);
            return addUpdate("applied", "update", hash, uid, '', itemCallback);
          });
        } else {
          var postHash = generateHash(post);
          if( postHash === dataHash ) {
            // Update has already been applied
            doLog(dataset_id, 'info', 'UPDATE Already Applied - uid=' + uid + ' : hash = ' + hash, params);
            return addUpdate("applied", "update", hash, uid, '', itemCallback);
          }
          else {
            doLog(dataset_id, 'warn', 'UPDATE COLLISION \n Pre record from client:\n' + util.inspect(sortObject(pre)) + '\n Current record from data store:\n' + util.inspect(sortObject(data)), params);
            dataset.collisionHandler(dataset_id, hash, timestamp, uid, pre, post);
            return addUpdate("collisions", "update", hash, uid, '', itemCallback);
          }
        }
      });
    }
    else if ( "delete" === action ) {
      doLog(dataset_id, 'info', 'DELETE Start', params);
      dataset.readHandler(dataset_id, uid, function(err, data) {
        if( err ) {
          doLog(dataset_id, 'warn', 'READ for DELETE Failed - uid=' + uid + ' : err = ' + err, params);
          return addUpdate("failed", "delete", hash, uid, err, itemCallback);
        }
        doLog(dataset_id, 'info', ' READ for DELETE Success', params);
        doLog(dataset_id, 'silly', ' READ for DELETE Data : \n' + util.inspect(data), params);

        var preHash = generateHash(pre);
        var dataHash = generateHash(data);

        doLog(dataset_id, 'info', 'DELETE Hash Check ' + uid + ' (client :: dataStore) = ' + preHash + ' :: ' + dataHash, params);

        if( dataHash == null ) {
          //record has already been deleted
          doLog(dataset_id, 'info', 'DELETE Already performed - uid=' + uid + ' : hash = ' + hash, params);
          return addUpdate("applied", "delete", hash, uid, '', itemCallback);
        }
        else {
          if( preHash === dataHash ) {
            dataset.deleteHandler(dataset_id, uid, function(err, data) {
              if( err ) {
                doLog(dataset_id, 'warn', 'DELETE Failed - uid=' + uid + ' : err = ' + err, params);
                return addUpdate("failed", "delete", hash, uid, err, itemCallback);
              }
              doLog(dataset_id, 'info', 'DELETE Success - uid=' + uid + ' : hash = ' + hash, params);
              return addUpdate("applied", "delete", hash, uid, '', itemCallback);
            });
          } else {
            doLog(dataset_id, 'warn', 'DELETE COLLISION \n Pre record from client:\n' + util.inspect(sortObject(pre)) + '\n Current record from data store:\n' + util.inspect(sortObject(data)), params);
            dataset.collisionHandler(dataset_id, hash, timestamp, uid, pre, post);
            return addUpdate("collisions", "delete", hash, uid, '', itemCallback);
          }
        }
      });
    }
    else {
      doLog(dataset_id, 'warn', 'unknown action : ' + action, params);
      itemCallback();
    }
  },
  function(err) {
    return cb();
  });
}

function returnUpdates(dataset_id, params, resIn, cb) {
  doLog(dataset_id, 'verbose', 'START returnUpdates', params);
  doLog(dataset_id, 'silly', 'returnUpdates - existing res = ' + util.inspect(resIn), params);
  var cuid = getCuid(params);
  db({
    "act": "list",
    "type": dataset_id + "-updates",
    "eq": {
      "cuid": cuid
    }
  }, function(err, res) {
    if (err) return cb(err);

    var updates = {};

    doLog(dataset_id, 'silly', 'returnUpdates - found ' + res.list.length + ' updates', params);

    for (var di = 0, dl = res.list.length; di < dl; di += 1) {
      var rec = res.list[di].fields;
      if ( !updates.hashes ) {
        updates.hashes = {};
      }
      updates.hashes[rec.hash] = rec;

      if( !updates[rec.type] ) {
        updates[rec.type] = {};
      }
      updates[rec.type][rec.hash] = rec;

      doLog(dataset_id, 'verbose', 'returning update ' + util.inspect(rec), params);
    }

    if( ! resIn ) {
      doLog(dataset_id, 'silly', 'returnUpdates - initialising res', params);
      resIn = {};
    }
    resIn.updates = updates;
    doLog(dataset_id, 'silly', 'returnUpdates - final res = ' + util.inspect(resIn), params);
    if( res.list.length > 0 ) {
      doLog(dataset_id, 'info', 'returnUpdates :: ' + util.inspect(updates.hashes), params);
    }
    return cb(null, resIn);
  });
}

function acknowledgeUpdates(dataset_id, params, cb) {

  var updates = params.acknowledgements;
  var cuid = getCuid(params);

  var itemCallback = function(err, update) {
    doLog(dataset_id, 'verbose', 'acknowledgeUpdates :: err=' + err + ' :: update=' + util.inspect(update), params);
  }

  if( updates && updates.length > 0) {
    doLog(dataset_id, 'info', 'acknowledgeUpdates :: ' + util.inspect(updates), params);

    async.forEachSeries(updates, function(update, itemCallback) {
      doLog(dataset_id, 'verbose', 'acknowledgeUpdates :: processing update ' + util.inspect(update), params);
      db({
        "act": "list",
        "type": dataset_id + "-updates",
        "eq": {
          "cuid": cuid,
          "hash": update.hash
        }
      }, function(err, res) {
        if (err) return itemCallback(err, update);

        if( res && res.list && res.list.length > 0 ) {
          var rec = res.list[0];
          var uid = rec.guid;
          db({
            "act": "delete",
            "type": dataset_id + "-updates",
            "guid": uid
          }, function(err, res) {
            if (err) return itemCallback(err, update);

            return itemCallback(null, update);
          });
        }
        else {
          return itemCallback(null, update);
        }
      });
    },
    function(err) {
      if( err ) {
        doLog(dataset_id, 'info', 'END acknowledgeUpdates - err=' + err, params);
      }
      cb(err);
    });
  }
  else {
    cb();
  }
}

function redoSyncList(dataset_id, query_params, cb) {
  getDataset(dataset_id, function(err, dataset) {
    if( err ) {
      return cb(err, null);
    }
    // Clear any existing timeouts so sync does not run multiple times
    var queryHash = generateHash(query_params);
    if( dataset && dataset.timeouts && dataset.timeouts[queryHash]) {
      doLog(dataset_id, 'info', 'redoSyncList :: Clearing timeout for dataset sync loop - queryParams : ' + util.inspect(query_params));
      clearTimeout(dataset.timeouts[queryHash]);
    }
    // Invoke the sync List;
    doSyncList(dataset_id, query_params, cb);
  });
}

function doSyncList(dataset_id, query_params, cb) {
  getDataset(dataset_id, function(err, dataset) {
    if( err ) {
      // doSyncList is recursively called with no callback. This means we must
      // check if cb exists before passing the error to it.
      if( cb ) {
        return cb(err, null);
      }
      else {
        doLog(dataset_id, 'error', 'Error getting dataset in doSyncList : ' + err);
        return;
      }
    }
    if( ! dataset.listHandler ) {
      return cb("no_listHandler", null);
    }

    dataset.listHandler(dataset_id, query_params, function(err, records) {
      if( err ) {
        if( cb ) {
          cb(err);
        }
        return;
      }

      var hashes = [];
      var shasum;
      var recOut = {};
      for(var i in records ) {
        var rec = {};
        var recData = records[i];
        var hash = generateHash(recData);
        hashes.push(hash);
        rec.data = recData;
        rec.hash = hash;
        recOut[i] = rec;
      }
      var globalHash = generateHash(hashes);

      var queryHash = generateHash(query_params);

      var previousHash = (dataset.syncLists[queryHash] && dataset.syncLists[queryHash].hash) ? dataset.syncLists[queryHash].hash : '<undefined>';
      doLog(dataset_id, 'verbose', 'doSyncList cb ' + ( cb != undefined) + ' - Global Hash (prev :: cur) = ' + previousHash + ' ::  ' + globalHash);

      dataset.syncLists[queryHash] = {"records" : recOut, "hash": globalHash};
      dataset.timeouts[queryHash] = setTimeout(function() {
        doSyncList(dataset_id, query_params);
      }, dataset.config.sync_frequency * 1000);
      if( cb ) {
        cb(null, dataset.syncLists[queryHash]);
      }
    });
  });
}


/* Synchronise the individual records for a dataset */
function doSyncRecords(dataset_id, params, callback) {
  doLog(dataset_id, 'verbose', 'doSyncRecords', params);
  // Verify that query_param have been passed
  if( ! params || ! params.query_params ) {
    return callback("no_query_params", null);
  }

  getDataset(dataset_id, function(err, dataset) {
    if( err ) {
      return callback(err, null);
    }
    var queryHash = generateHash(params.query_params);
    if( dataset.syncLists[queryHash] && dataset.syncLists[queryHash].records) {
      // We have a data set for this dataset_id and query hash - compare the uid and hashe values of
      // our records with the record received

      var creates = {};
      var updates = {};
      var deletes = {};
      var i;

      var serverRecs = dataset.syncLists[queryHash].records;

      var clientRecs = {};
      if( params && params.clientRecs) {
        clientRecs = params.clientRecs;
      }

      for( i in serverRecs ) {
        var serverRec = serverRecs[i];
        var serverRecUid = i;
        var serverRecHash = serverRec.hash;

        if( clientRecs[serverRecUid] ) {
          if( clientRecs[serverRecUid] !== serverRecHash ) {
            doLog(dataset_id, 'info', 'Updating client record ' + serverRecUid + ' client hash=' + clientRecs[serverRecUid], params);
            updates[serverRecUid] = serverRec;
          }
        } else {
          doLog(dataset_id, 'info', 'Creating client record ' + serverRecUid, params);
          creates[serverRecUid] = serverRec;
        }
      }

      // Itterate over each of the client records. If there is no corresponding server record then mark the client
      // record for deletion
      for( i in clientRecs ) {
        if( ! serverRecs[i] ) {
          deletes[i] = {};
        }
      }

      var res = {"create": creates, "update": updates, "delete":deletes, "hash":dataset.syncLists[queryHash].hash};
      callback(null, res);
    } else {
      // No data set invoke the list operation on back end system,
      redoSyncList(dataset_id, params.query_params, function(err, res) {
        callback(err, res);
      });
    }
  });
}

function getDataset(dataset_id, cb) {

  // TODO - Persist data sets - in memory or more permanently ($fh.db())
  if( deleted_datasets[dataset_id] ) {
    return cb("unknown_dataset", null);
  }
  else {
    var dataset = datasets[dataset_id];
    if( ! dataset ) {
      return cb("unknown_dataset", null);
    }
    else {
      return cb(null, dataset);
    }
  }
}

function createDataset(dataset_id, cb) {
  delete deleted_datasets[dataset_id];

  var dataset = datasets[dataset_id];
  if( ! dataset ) {
    dataset = {};
    dataset.id = dataset_id;
    dataset.created = new Date().getTime();
    dataset.syncLists = {};
    dataset.timeouts = {};
    datasets[dataset_id]= dataset;
  }
  cb(null, dataset);
}

function removeDataset(dataset_id, cb) {

  // TODO - Persist data sets - in memory or more permanently ($fh.db())
  deleted_datasets[dataset_id] = new Date().getTime();

  delete datasets[dataset_id];

  cb(null, {});
}

function generateHash(plainText) {
  var hash;
  if( plainText ) {
    if ('string' !== typeof plainText) {
      plainText = sortedStringify(plainText);
    }
    var shasum = crypto.createHash('sha1');
    shasum.update(plainText);
    hash = shasum.digest('hex');
  }
  return hash;
}

function sortObject(object) {
  if (typeof object !== "object" || object === null) {
    return object;
  }

  var result = [];

  Object.keys(object).sort().forEach(function(key) {
    result.push({
      key: key,
      value: sortObject(object[key])
    });
  });

  return result;
}


function sortedStringify(obj) {

  var str = '';

  try {
    var soretdObject = sortObject(obj);
    if(obj) {
      str = JSON.stringify(sortObject(obj));
    }
  } catch (e) {
    doLog(SYNC_LOGGER, 'error', 'Error stringifying sorted object:' + e);
    throw e;
  }

  return str;
}

function setLogger(dataset_id, options) {
  var level = options.logLevel;
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: level, debugStdout: true })
    ]
  });
  loggers[dataset_id] = logger;
}

function doLog(dataset_id, level, msg, params) {

  var logger = loggers[dataset_id] || loggers[SYNC_LOGGER];
  if( logger ) {
    var logMsg = moment().format('YYYY-MM-DD HH:mm:ss') + ' [' + dataset_id + '] ';
    logMsg += '(' + getCuid(params)  + ')';
    logMsg = logMsg + ': ' +msg;

    logger.log(level, logMsg);
  }
}

function getCuid(params) {
  var cuid = '';
  if( params && params.__fh && params.__fh.cuid ) {
    cuid = params.__fh.cuid;
  }
  return cuid;
}

/* ======================================================= */
/* ================== PRIVATE VARIABLES ================== */
/* ======================================================= */

var loggers = {};

var datasets = {};

var deleted_datasets = {};

// CONFIG
var defaults = {
  "sync_frequency": 10,
  "logLevel" : "info"
};

// Functions which can be invoked through sync.doInvoke
var invokeFunctions = {
  "sync" : doClientSync,
  "syncRecords" : doSyncRecords,
  "listCollisions": doListCollisions,
  "removeCollision": doRemoveCollision,
  "setLogLevel" : doSetLogLevel
};


/* ======================================================= */
/* =================== INITIALISATION ==================== */
/* ======================================================= */
setLogger(SYNC_LOGGER, {logLevel : defaults.logLevel});

/*
 This function gets called by api.js to init sync, so it can in turn init a connector to $fh.db
 */
module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  db = require('./db.js')(cfg);
  return sync;
};