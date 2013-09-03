// Copyright (c) FeedHenry 2011
var util = require('util'),
dataHandler = require('./fixtures/syncHandler');
var syncParams = {
  "fn": "sync",
  "dataset_id": "myShoppingList",
  "query_params": {},
  "pending": []
};
var logParams = {
  "fn": "setLogLevel",
  "logLevel" : "error"
};
var dataset_id = "myShoppingList";

var $fh, ditchMock;

module.exports = {
  setUp : function(test, assert){
    ditchMock = require('./fixtures/db');
    $fh = require("../lib/api.js");

    $fh.sync.init(dataset_id, {}, function() {
      $fh.sync.handleList(dataset_id, dataHandler.doList);
      $fh.sync.handleCreate(dataset_id, dataHandler.doCreate);
      $fh.sync.handleRead(dataset_id, dataHandler.doRead);
      $fh.sync.handleUpdate(dataset_id, dataHandler.doUpdate);
      $fh.sync.handleDelete(dataset_id, dataHandler.doDelete);
      $fh.sync.handleCollision(dataset_id, dataHandler.doCollision);
      $fh.sync.listCollisions(dataset_id, dataHandler.listCollisions);
      $fh.sync.removeCollision(dataset_id, dataHandler.removeCollision);
      test.finish();
    });
  },
  'test sync start & stop' : function(test, assert) {

    $fh.sync.invoke('myShoppingList', logParams, function(err, res){
      assert.ok(!err, 'Error: ' + err);
      assert.ok(res.status);
      assert.equal("ok", res.status, "Unexpected response: " + util.inspect(res));
      test.finish();
    });
  },

  'test sync' : function(test, assert) {
    $fh.sync.invoke('myShoppingList', syncParams, function(err, res){
      assert.ok(!err, 'Error: ' + err);
      assert.ok(res);
      assert.ok(res.records);
      test.finish();
    });
  },
  'tearDown' : function(test, assert){
    $fh.sync.stopAll(function(err, res){
      assert.ok(!err, 'Error: ' + err);
      assert.ok(res);
      test.finish();
      ditchMock.done();
    });
  }
};
