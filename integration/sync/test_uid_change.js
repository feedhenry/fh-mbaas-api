var sync = require('../../lib/sync');
var assert = require('assert');
var async = require('async');
var helper = require('./helper');
var util = require('util');

var mongoDBUrl = 'mongodb://127.0.0.1:27017/test_sync_uid_change';
var redisUrl = 'redis://127.0.0.1:6379';
var DATASETID = 'syncUidChangeTest';
var TESTCUID = 'syncUidChangeTestCuid';

var mongodb;

module.exports = {
  'test sync data uid change': {
    'before': function(done) {
       sync.api.setConfig({
        pendingWorkerInterval: 10, 
        pendingWorkerBackoff: {strategy: 'none'},
        ackWorkerInterval: 100, 
        schedulerInterval: 100
      });

      async.series([
        async.apply(sync.api.connect, mongoDBUrl, null, redisUrl),
        async.apply(sync.api.init, DATASETID, {syncFrequency: 1}),
        function resetdb(callback) {
          helper.resetDb(mongoDBUrl, DATASETID, function(err, db){
            if (err) {
              return callback(err);
            }
            mongodb = db;
            return callback();
          });
        }
      ], done);
    },

    'after': function(done) {
      sync.api.stopAll(done);
    },

    'data uid change': function(done) {
      var clientUid = 'a1';
      var params = {
        fn: 'sync',
        query_params: {user: '1'},
        meta_data: {token: 'testtoken'},
        __fh: {
          cuid: TESTCUID
        },
        pending: [{
          action: 'create',
          uid: clientUid,
          hash: 'a1',
          post: {
            'user': '1',
            'a': '1'
          }
        }, {
          action: 'update',
          uid: clientUid,
          hash: 'a2',
          pre: {
            'user': '1',
            'a': '1'
          },
          post: {
            'user': '1',
            'a': '2'
          }
        }]
      };
      var serverUid;
      var collection = mongodb.collection(DATASETID);
      async.series([
        function invokeSync(callback) {
          sync.api.invoke(DATASETID, params, function(err, response){
            assert.ok(!err, util.inspect(err));
            assert.ok(response);
            callback();
          });
        },
        function wait(callback) {
          setTimeout(callback, 1000);
        },
        function checkDataUpdated(callback) {
          collection.findOne({'user': '1'}, function(err, found){
            assert.ok(!err);
            assert.equal(found.a, '2');
            serverUid = found._id.toString();
            callback();
          });
        },
        function newUpdateWithNewUid(callback) {
          params.pending = [{
            action: 'update',
            uid: serverUid,
            hash: 'a3',
            pre: {
              'user': '1',
              'a': '2'
            },
            post : {
              'user': '1',
              'a': '3'
            }
          }];
          sync.api.invoke(DATASETID, params, function(err, response){
            assert.ok(!err);
            assert.ok(response);
            callback();
          });
        },
        function waitAgain(callback) {
          setTimeout(callback, 20);
        },
        function checkDataUpdatedAgain(callback) {
          collection.findOne({'user': '1'}, function(err, found){
            assert.ok(!err);
            assert.equal(found.a, '3');
            callback();
          });
        },
        function deleteWithOldUid(callback) {
          params.pending = [{
            action: 'delete',
            uid: clientUid,
            hash: 'a4',
            pre: {
              'user': '1',
              'a': '3'
            }
          }];
          sync.api.invoke(DATASETID, params, function(err, response){
            assert.ok(!err);
            assert.ok(response);
            callback();
          });
        },
        function waitForDelete(callback) {
          setTimeout(callback, 20);
        },
        function checkDataDeleted(callback) {
          collection.findOne({'user': '1'}, function(err, found){
            assert.ok(!err);
            assert.ok(!found);
            callback();
          });
        },
      ], done);
    }
  }
};
