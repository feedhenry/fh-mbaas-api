
// Copyright (c) FeedHenry 2011
var util = require('util'),
ditchMock = require('./fixtures/db'),
$fh;
var assert = require('assert');


module.exports = {
  'test ditch fh.db': function(finish) {
    $fh = require("../lib/api.js");
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
              "fistName": "Jane"
            }}, function(err, res) {
            assert.equal(err, null, "Err not null: " + util.inspect(err));
            $fh.db({
              "act" : "export"
            }, function(err, res){
              assert.equal(err, null);
              assert.ok(res);
              assert.ok(res.stream);
              $fh.db({
                "act" : "import",
                "files" : {
                  "toimport" : {
                    "path" : __dirname + '/fixtures/dbexport.zip'
                  }
                }
              }, function(err, res){
                $fh.db({
                  "act" : "delete",
                  "type" : "myFirstEntity",
                  "guid" : res.guid
                }, function(err, res){
                  assert.equal(err, null, "Err not null: " + util.inspect(err));
                  ditchMock.done();
                  finish();
                }); // end delete
              });
            });// end export
          }); // end update
        }); // end read
      }); // end list
    }); // end create
  },

  'test dbperapp fh.db': function(finish) {

    //When the dbperapp environment variable is set, The same tests should now return an error message
    process.env['FH_DB_PERAPP'] = true;

    (function(finish) {
      $fh = require("../lib/api.js");
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
        assert.ok(!res);
        assert.ok(err && err.message === "Data storage not enabled for this app. Please use the Data Browser window to enable data storage.");

        $fh.db({
          "act": "list",
          "type": "myFirstEntity"
        }, function(err, res){
          assert.ok(!res);
          assert.ok(err && err.message === "Data storage not enabled for this app. Please use the Data Browser window to enable data storage.");

          ditchMock.done();
          finish();

        }); // end list
      }); // end create
    })(finish);
  },

  "test os3 mbaas will be called to retrieve mongo connectin string": function(finish){
    finish()
  }
};
