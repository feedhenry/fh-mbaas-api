var syncUtil = require('./sync-util');
var fhdb;

var setFHDB = function(db) {
  fhdb = db;
};

var create = function(dataset_id, data, cb) {
  // Check if the Update has already been recorded, then create it if it doesn't
  fhdb({
    "act": "list",
    "type": dataset_id + "-updates",
    "eq": {
      "cuid": data.cuid,
      "type": data.type,
      "action": data.action,
      "hash": data.hash,
      "uid": data.uid
    }
  }, function (err, found) {
    if (err) return cb(err);
    if (found && found.list && found.list.length > 0) {
      syncUtil.doLog(dataset_id, 'info', 'Update is already recorded, ignore', data);
      return cb(null, found.list[0]);
    } else {
      fhdb({
        "act": "create",
        "type": dataset_id + "-updates",
        "fields": data
      }, function (err, res) {
        cb(err, res);
      });
    }
  });
};

var list = function(dataset_id, eq, cb) {
  fhdb({
    "act": "list",
    "type": dataset_id + "-updates",
    "eq": eq
  }, function(err, records) {
    if (err) return cb(err);
    var res = [];
    if (records.list && records.list.length) {
      records.list.forEach(function(record){
        record.fields._id = record.guid;
        res.push(record.fields);
      });
    }
    return cb(null, res);
  });
};

var remove = function(dataset_id, data, cb) {
  // Check if the record already exists, then remove it if it does
  fhdb({
    "act": "list",
    "type": dataset_id + "-updates",
    "eq": {
      "cuid": data.cuid,
      "hash": data.hash
    }
  }, function (err, res) {
    if (err) return cb(err, data);

    if (res && res.list && res.list.length > 0) {
      var rec = res.list[0];
      var uid = rec.guid;
      fhdb({
        "act": "delete",
        "type": dataset_id + "-updates",
        "guid": uid
      }, function (err) {
        if (err) return cb(err, data);

        return cb(null, data);
      });
    }
    else {
      return cb(null, data);
    }
  });
};

module.exports = {
  create: create,
  list: list,
  remove: remove,
  setFHDB: setFHDB
}