var datasets = {};
var deletedDatasets = {};
var datasetClientRecords = {};

var storage = {
  getDatasets: function(cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ getDatasets', Object.keys(datasets));//, JSON.stringify(new Error().stack));
    process.nextTick(function() {
      return cb(null, JSON.parse(JSON.stringify(datasets)));
    });
  },
  getDataset: function(dataset_id, cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ getDataset dataset_id', dataset_id, JSON.stringify(new Error().stack));
    process.nextTick(function() {
      if (datasets[dataset_id]) {
        return cb(null, JSON.parse(JSON.stringify(datasets[dataset_id])));
      }
      return cb(null, null);
    });
  },
  saveDataset: function(dataset_id, dataset, cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ saveDataset dataset_id', dataset_id, JSON.stringify(new Error().stack), dataset);
    delete deletedDatasets[dataset_id]; // explicitly saving the dataset, so remove it from deleted dataset list, if its there
    datasets[dataset_id] = JSON.parse(JSON.stringify(dataset));
    process.nextTick(function() {
      return cb(null, dataset);
    });
  },
  removeDataset: function(dataset_id, cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ removeDataset dataset_id', dataset_id, JSON.stringify(new Error().stack));
    delete datasets[dataset_id];
    deletedDatasets[dataset_id] = new Date().getTime();
    process.nextTick(function() {
      return cb(null, {});
    });
  },
  isDeletedDataset: function(dataset_id, cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ isDeletedDataset dataset_id', dataset_id, JSON.stringify(new Error().stack));
    process.nextTick(function() {
      return cb(null, deletedDatasets[dataset_id]);
    })
  },
  getDatasetClientRecords: function(datasetClientId, cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ getDatasetClientRecords datasetClientId', datasetClientId, JSON.stringify(new Error().stack));
    process.nextTick(function() {
      return cb(null, JSON.parse(JSON.stringify(datasetClientRecords[datasetClientId])));
    });
  },
  saveDatasetClientRecords: function(datasetClientId, datasetClientRecord, cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ saveDatasetClientRecords datasetClientId', datasetClientId, JSON.stringify(new Error().stack));
    datasetClientRecords[datasetClientId] = JSON.parse(JSON.stringify(datasetClientRecord));
    process.nextTick(function() {
      return cb();
    });
  },
  removeDatasetClientRecords: function(datasetClientId, cb) {
    console.log('~~~!!! DATASTORAGE !!!~~~~ removeDatasetClientRecords datasetClientId', datasetClientId, JSON.stringify(new Error().stack));
    delete datasetClientRecords[datasetClientId];
    process.nextTick(function() {
      return cb();
    });
  }
};

module.exports = storage;