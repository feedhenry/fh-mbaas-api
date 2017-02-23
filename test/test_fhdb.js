
// Copyright (c) FeedHenry 2011
var util = require('util'),
ditchMock = require('./fixtures/db'),
$fh;
var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

module.exports = {
  tearDown: function() {
    process.env.FH_MBAAS_TYPE = 'feedhenry';
  },

  "test os3 mbaas will be called to retrieve mongo connection string": function(finish){
    delete process.env['FH_MONGODB_CONN_URL'];
    delete process.env['OPENSHIFT_MONGODB_DB_HOST'];
    process.env['FH_MBAAS_TYPE'] = 'openshift3';
    var localdbStub = sinon.stub().callsArgAsync(1);
    var databaseConnectionStringStub = sinon.stub().callsArgWithAsync(1, null, {
      url: 'test-url' });

    var dbStub = sinon.stub().returns(function(option, cb) {
      cb(null, null);
    });

    $fh = proxyquire('../lib/api.js', {
      './db': proxyquire('../lib/db.js', {
        'fh-mbaas-client': {
          'app': {
            'databaseConnectionString': databaseConnectionStringStub
          }
        },
        'fh-db': {
          'local_db': localdbStub
        }
      }),
      './sync-srv': proxyquire('../lib/sync-srv.js', {
        './db': dbStub
      })
    });
    $fh.db({
      "act" : "create",
      "type" : "myFirstEntity",
      "fields" : {
        "firstName" : "Joe",
        "lastName" : "Bloggs",
        "address1" : "22 Blogger Lane",
        "address2" : "Bloggsville",
        "country" : "Bloggland",
        "phone" : "555-123456"
      }
    }, function(err, res){
      assert.ok(!err, err);
      sinon.assert.calledOnce(localdbStub);
      sinon.assert.calledOnce(databaseConnectionStringStub);
      finish();
    });
  },

  "test get connection string os3 action" : function(finish){
    delete process.env['FH_MONGODB_CONN_URL'];
    delete process.env['OPENSHIFT_MONGODB_DB_HOST'];
    process.env['FH_MBAAS_TYPE'] = 'openshift3';
    var localdbStub = sinon.stub().callsArgAsync(1);
    var databaseConnectionStringStub = sinon.stub().callsArgWithAsync(1, null, {
      url: 'test-url'
    });

    $fh = proxyquire('../lib/api.js', {
      './db': proxyquire('../lib/db.js', {
        'fh-mbaas-client': {
          'app': {
            'databaseConnectionString': databaseConnectionStringStub
          }
        },
        'fh-db': {
          'local_db': localdbStub
        }
      })
    });
    $fh.db({
      "act" : "connectionString"
    }, function(err, res){
      assert.ok(!err, err);
      assert.ok(res === "test-url", "expected the mongo url to match");
      finish();
    });
  },


  "test get connection string os2 action" : function(finish){
    delete process.env['FH_MONGODB_CONN_URL'];
    delete process.env['OPENSHIFT_MONGODB_DB_HOST'];
    process.env['FH_MBAAS_TYPE'] = 'openshift';
    process.env.OPENSHIFT_MONGODB_DB_HOST  = "testhost";
    process.env.OPENSHIFT_MONGODB_DB_USERNAME = "testuser";
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD  = "testpass";
    process.env.OPENSHIFT_MONGODB_DB_PORT = "2072"
    process.env.OPENSHIFT_APP_NAME = "testapp"

    $fh.db({
      "act" : "connectionString"
    }, function(err, res){
      assert.ok(!err, err);
      assert.ok(res === "mongodb://testuser:testpass@testhost:2072/testapp", "expected the mongo url to match " + res);
      finish();
    });
  },
  "test get existing connection string action" : function(finish){
    delete process.env['FH_MONGODB_CONN_URL']
    process.env['FH_MONGODB_CONN_URL'] = "mongodb://testuser:testpass@testhost:2072/testapp";
    delete process.env['OPENSHIFT_MONGODB_DB_HOST'];
    process.env['FH_MBAAS_TYPE'] = 'feedhenry';

    $fh.db({
      "act" : "connectionString"
    }, function(err, res){
      assert.ok(!err, err);
      assert.ok(res === "mongodb://testuser:testpass@testhost:2072/testapp", "expected the mongo url to match " + res);
      finish();
    });
  }
};
