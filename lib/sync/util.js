var crypto = require('crypto');
var winston = require('winston');
var moment = require('moment');
var assert = require('assert');
var _ = require('underscore');

var SYNC_LOGGER = 'SYNC';
var loggers = {};

function generateHash(plainText) {
  var hash;
  if (plainText) {
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

  Object.keys(object).sort().forEach(function (key) {
    result.push({
      key: key,
      value: sortObject(object[key])
    });
  });

  return result;
}


function sortedStringify(obj) {
  return obj ? JSON.stringify(sortObject(obj)) : '';
}

function setLogger(dataset_id, options) {
  var level = options.logLevel;
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({level: level, debugStdout: true})
    ]
  });

  loggers[dataset_id] = logger;
}

function doLog(dataset_id, level, msg, params) {

  var logger = loggers[dataset_id] || loggers[SYNC_LOGGER];
  if (logger) {
    var logMsg = moment().format('YYYY-MM-DD HH:mm:ss') + ' [Worker ' + process.pid + ']' + ' [' + dataset_id + '] ';
    logMsg += '(' + getCuid(params) + ')';
    logMsg = logMsg + ': ' + msg;

    logger.log(level, logMsg);
  }
}

function getCuid(params) {
  var cuid = '';
  if (params && params.__fh && params.__fh.cuid) {
    cuid = params.__fh.cuid;
  }
  return cuid;
}

/**
 * convert the given array to an object, use the `uid` field of each item as the key
 * @param {Array} itemArr
 * @returns an object
 */
function convertToObject(itemArr) {
  var obj = {};
  _.each(itemArr, function(item){
    obj[item.uid] = item;
  });
  return obj;
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
module.exports.convertToObject = convertToObject;
module.exports.SYNC_LOGGER = SYNC_LOGGER;
