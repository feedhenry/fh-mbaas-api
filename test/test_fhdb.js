
// Copyright (c) FeedHenry 2011
var util = require('util'),
fhs = require('../lib/apis.js'),
fhsConfig = require('./fixtures/fhsConfig'),
ditchMock = require('./fixtures/dbReplies')



module.exports = {
  // TODO: following tests are quite brittle as they rely on the VNV ditch server being up..
  // However, its the only way to really test it..
  'test fh.db': function(test, assert) {
    var fhserver = new fhs.FHServer(fhsConfig.cfg, fhsConfig.logger);
    fhserver.db({
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
      assert.equal(err, null, "Err not null: " + util.inspect(err));
      fhserver.db({
        "act": "list",
        "type": "myFirstEntity"
      }, function(err, res){
        assert.equal(err, null, "Err not null: " + util.inspect(err));
        assert.ok(res.list[0]);
        assert.ok(res.list[0].guid);
        var guid = res.list[0].guid;
        fhserver.db({
          "act" : "read",
          "type" : "myFirstEntity",
          "guid" : guid
        }, function(err, res){
          assert.equal(err, null, "Err not null: " + util.inspect(err));
          fhserver.db({
            "act" : "update",
            "type" : "myFirstEntity",
            "guid" : res.guid,
            "fields": {
              "fistName": "Jane",
            }}, function(err, res) {
            assert.equal(err, null, "Err not null: " + util.inspect(err));
            fhserver.db({
              "act" : "delete",
              "type" : "myFirstEntity",
              "guid" : res.guid
            }, function(err, res){
              assert.equal(err, null, "Err not null: " + util.inspect(err));
              ditchMock.done();
              test.finish();
            }); // end delete
          }); // end update
        }); // end read
      }); // end list
    }); // end create
  }
};
