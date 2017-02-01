var fhdb;
var mongo;

var setFHDB = function(db) {
  fhdb = db;
  db({
    act: 'getDitcher'
  }, function onGetClient(err, ditcher) {
    mongo = ditcher.database.getMongoClient();
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
  setFHDB: setFHDB
}
