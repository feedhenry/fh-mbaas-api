var asyncJson = require('async-json');
var crypto = require('crypto');
var winston = require('winston');
var moment = require('moment');
var assert = require('assert');

var SYNC_LOGGER = 'SYNC';
var loggers = {};

var generateHash = function (toHash, cb) {
  // Sort the object and JSON stringify it.
  //console.log('sortedStringifyBefore')
  sortedStringify(toHash, function (err, jsonString) {
    //console.log('sortedStringify')
    if(err) {
      return cb(err);
    }
    // Generate sha1 hash of the new JSON string.
    var shasum = crypto.createHash('sha1');
    shasum.update(jsonString);
    hash = shasum.digest('hex');

    return cb(null, hash);
  });  
}

var sortObject = function (object) {
  if (typeof object !== "object" || object === null) {
    return object;
  }

  var result = [];

  Object.keys(object).sort().forEach(function (key) {
    result.push({
      key: key,
      value: sortObject(object[key])
    });
  });

  return result;
}


var sortedStringify = function (obj, cb) {
  // Maintaining some tiny amount of backwards compatibility with sync version.
  if (typeof obj === 'string') {
    return cb(null, obj)
  }

  if (obj) {
    //console.log('asyncStringifyBefore')
    asyncJson.stringify(sortObject(obj), function stringifyComplete(err, jsonString) {
      //console.log('asyncStringify')
      return cb(err, jsonString);
    });
  } 

  return cb(null, '');
}

var setLogger = function (dataset_id, options) {
  var level = 'info';
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({level: level, debugStdout: true})
    ]
  });

  loggers[dataset_id] = logger;
}

var doLog = function (dataset_id, level, msg, params) {

  var logger = loggers[dataset_id] || loggers[SYNC_LOGGER];
  if (logger) {
    var logMsg = moment().format('YYYY-MM-DD HH:mm:ss') + ' [' + dataset_id + '] ';
    logMsg += '(' + getCuid(params) + ')';
    logMsg = logMsg + ': ' + msg;

    logger.log(level, logMsg);
  }
}

var getCuid = function (params) {
  var cuid = '';
  if (params && params.__fh && params.__fh.cuid) {
    cuid = params.__fh.cuid;
  }
  return cuid;
}

exports.ensureHandlerIsFunction = function (target, fn) {
  assert.equal(
    typeof fn,
    'function',
    'sync handler (' + target + ') must be a function'
  );
};

module.exports.generateHash = generateHash;
module.exports.sortObject = sortObject;
module.exports.sortedStringify = sortedStringify;
module.exports.setLogger = setLogger;
module.exports.doLog = doLog;
module.exports.getCuid = getCuid;
module.exports.SYNC_LOGGER = SYNC_LOGGER;
