
// Copyright (c) FeedHenry 2011
var util = require('util'),
ditchMock = require('./fixtures/db'),
$fh;



module.exports = {
  'test fh.db': function(test, assert) {
    $fh = require("../lib/apis.js");
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
      assert.equal(err, null, "Err not null: " + util.inspect(err));
      $fh.db({
        "act": "list",
        "type": "myFirstEntity"
      }, function(err, res){
        assert.equal(err, null, "Err not null: " + util.inspect(err));
        assert.ok(res.list[0]);
        assert.ok(res.list[0].guid);
        var guid = res.list[0].guid;
        $fh.db({
          "act" : "read",
          "type" : "myFirstEntity",
          "guid" : guid
        }, function(err, res){
          assert.equal(err, null, "Err not null: " + util.inspect(err));
          $fh.db({
            "act" : "update",
            "type" : "myFirstEntity",
            "guid" : res.guid,
            "fields": {
              "fistName": "Jane",
            }}, function(err, res) {
            assert.equal(err, null, "Err not null: " + util.inspect(err));
            $fh.db({
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
