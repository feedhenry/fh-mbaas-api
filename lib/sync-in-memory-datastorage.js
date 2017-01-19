var datasets = {};
var deletedDatasets = {};
var datasetClientRecords = {};

var storage = {
  getDataSets: function(cb) {
    process.nextTick(function() {
      return cb(null, JSON.parse(JSON.stringify(datasets)));
    });
  },
  getDataSet: function(dataset_id, cb) {
    process.nextTick(function() {
      return cb(null, JSON.parse(JSON.stringify(datasets[dataset_id])));
    });
  },
  saveDataSet: function(dataset_id, dataset, cb) {
    delete deletedDatasets[dataset_id]; // explicitly saving the dataset, so remove it from deleted dataset list, if its there
    datasets[dataset_id] = JSON.parse(JSON.stringify(dataset));
    process.nextTick(function() {
      return cb(null, dataset);
    });
  },
  removeDataSet: function(dataset_id, cb) {
    delete datasets[dataset_id];
    deletedDatasets[dataset_id] = new Date().getTime();
    process.nextTick(function() {
      return cb(null, {});
    });
  },
  isDeletedDataSet: function(dataset_id, cb) {
    process.nextTick(function() {
      return cb(null, deletedDatasets[dataset_id]);
    })
  },
  getDataSetClientRecords: function(datasetClientId, cb) {
    process.nextTick(function() {
      return cb(null, JSON.parse(JSON.stringify(datasetClientRecords[datasetClientId])));
    });
  },
  saveDataSetClientRecords: function(datasetClientId, dataSetClientRecord, cb) {
    datasetClientRecords[datasetClientId] = JSON.parse(JSON.stringify(dataSetClientRecord));
    process.nextTick(function() {
      return cb();
    });
  },
  removeDataSetClientRecords: function(datasetClientId, cb) {
    delete datasetClientRecords[datasetClientId];
    process.nextTick(function() {
      return cb();
    });
  }
};

module.exports = storage;