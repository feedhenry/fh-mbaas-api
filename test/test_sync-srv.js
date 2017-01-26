var util = require('util');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var dataHandler = require('./fixtures/syncHandler');
var assert = require('assert');

var dataset_id = "myShoppingList";
var config = {
  fhapi: {
    appname : 'test_sync-srv'
  },
  fhditch: {
    host: 'localhost',
    port: 443,
    protocol: 'https'
  }
};
var mongoStub = {
  create: sinon.stub().callsArgWith(2, null, {}),
  list: sinon.stub().callsArgWith(2, null, {
     forEach: sinon.stub()
  }),
  remove: sinon.stub().callsArgWith(2, null),
  setFHDB: sinon.stub(),
  setConnectionUrl: sinon.stub()
};

module.exports = {
  setUp : function(finish){

    var dbStub = sinon.stub().returns(function(option, cb) {
      cb(null, "dummy:connectionstring");
    });
    sync = proxyquire("../lib/sync-srv.js", {
      './sync-UpdatesModel_mongo.js': mongoStub,
      './db': dbStub
    })(config);

    sync.init(dataset_id, {}, function() {
      sync.handleList(dataset_id, dataHandler.doList);
      sync.handleCreate(dataset_id, dataHandler.doCreate);
      sync.handleRead(dataset_id, dataHandler.doRead);
      sync.handleUpdate(dataset_id, dataHandler.doUpdate);
      sync.handleDelete(dataset_id, dataHandler.doDelete);
      sync.handleCollision(dataset_id, dataHandler.doCollision);
      sync.listCollisions(dataset_id, dataHandler.listCollisions);
      sync.removeCollision(dataset_id, dataHandler.removeCollision);
      finish();
    });
  },

  'test sync with acknowledgements' : function(finish) {
    var params = {
      "fn": "sync",
      "dataset_id": dataset_id,
      "query_params": {},
      "pending": [],
      "acknowledgements": [
        { "cuid":"95F6C8E085F24D278280CE3480290A3C",
          "type":"applied",
          "action":"create",
          "hash":"e062e09d2b83e3753c89dd56376f50262c197ee1",
          "uid":"5889b2de859084ac853c88e3",
          "msg":"''"
         }
        ]
    };
    sync.invoke('myShoppingList', params, function(err, res){
      assert.ok(!err, 'Error: ' + err);
      assert.ok(mongoStub.list.called);
      assert.ok(mongoStub.remove.called);
      finish();
    });
  },

};
