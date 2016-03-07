
// Copyright (c) FeedHenry 2011
var util = require('util'),
ditchMock = require('./fixtures/db'),
$fh;
var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

module.exports = {
  "test os3 mbaas will be called to retrieve mongo connection string": function(finish){
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
  }
};
