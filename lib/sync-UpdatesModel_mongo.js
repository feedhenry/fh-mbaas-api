var syncUtil = require('./sync-util');
var MongoClient = require('mongodb').MongoClient;
var fhdb;
var mongo;

var setFHDB = function(db) {
  fhdb = db;
};

var setConnectionUrl = function(url) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    syncUtil.doLog(syncUtil.SYNC_LOGGER, 'info', 'sync-UpdatesModel MongoClient connected');

    mongo = db;
  });
};

var create = function(dataset_id, data, cb) {
  return mongo.collection(dataset_id + "-updates").insertOne(data, cb);
};

var list = function(dataset_id, eq, cb) {
  return mongo.collection(dataset_id + "-updates").find(eq).toArray(cb);
};

var remove = function(dataset_id, data, cb) {
  var toDelete = {
    cuid: data.cuid,
    hash: data.hash
  };
  return mongo.collection(dataset_id + "-updates").deleteOne(toDelete, cb);
};

module.exports = {
  create: create,
  list: list,
  remove: remove,
  setFHDB: setFHDB,
  setConnectionUrl: setConnectionUrl
}