var assert = require('assert');
var sinon = require('sinon');
var syncProcessor = require('../../lib/sync/sync-processor');
var datasets = require('../../lib/sync/datasets');

var syncStorage = {
  updateDatasetClient: sinon.stub(),
  updateDatasetClientWithRecords: sinon.stub()
};

var dataHandler = {
  doList: sinon.stub(),
  countCollisions: sinon.stub()
};

var metricsClient = {
  gauge: sinon.spy()
};

var hashProvider = {
  recordHash: function(datasetId, data){
    return data;
  },
  globalHash: function(datasetId, hashes){
    return hashes.join('');
  }
};

var records = {
  "1": "a",
  "2": "b",
  "3": "c"
};

module.exports = {
  'test sync request processor': function(done) {
    var processor = syncProcessor(syncStorage, dataHandler, metricsClient, hashProvider);
    var job = {
      payload: {
        id: "testDataset-test-test",
        datasetId: 'testDataset',
        startTime: new Date().getTime()
      }
    };

    syncStorage.updateDatasetClient.yieldsAsync();
    dataHandler.doList.yieldsAsync(null, records);
    dataHandler.countCollisions.yieldsAsync(null, 1);
    syncStorage.updateDatasetClientWithRecords.yieldsAsync();

    processor(job, function(err){
      assert.ok(!err);
      assert.ok(dataHandler.doList.calledOnce);
      assert.ok(dataHandler.doList.calledWith(job.payload.datasetId, {}, {}));
      assert.ok(dataHandler.countCollisions.calledWith(job.payload.datasetId, {}));
      assert.ok(syncStorage.updateDatasetClient.calledTwice);
      assert.ok(syncStorage.updateDatasetClientWithRecords.calledOnce);
      assert.ok(syncStorage.updateDatasetClientWithRecords.calledWith(job.payload.id, {globalHash: "abc1"}));
      assert.ok(metricsClient.gauge.calledOnce);
      done();
    });
  },

  'test sync list timeout': function(done) {
    var datasetId = "testDatasetTimeout";
    datasets.init(datasetId, {backendListTimeout: 1});

    dataHandler.doList = function(datasetId, query, meta, cb){
      setTimeout(function(){
        return cb(null, records);
      }, 2000);
    };

    syncStorage.updateDatasetClient.reset();
    syncStorage.updateDatasetClientWithRecords.reset();
    syncStorage.updateDatasetClient.yieldsAsync();

    var processor = syncProcessor(syncStorage, dataHandler, metricsClient, hashProvider);
    var job = {
      payload: {
        id:  datasetId + "-test-test",
        datasetId: datasetId,
        startTime: new Date().getTime()
      }
    };

    processor(job, function(err){
      assert.ok(!err);
      assert.equal(syncStorage.updateDatasetClientWithRecords.callCount, 0);
      done();
    });
  }
};