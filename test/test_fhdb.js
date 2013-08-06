
// Copyright (c) FeedHenry 2011

var util = require('util');
var fhs = require("../lib/apis.js");
var cfg = {
  'fhnodeapp' : {
    'millicore' : 'apps.feedhenry.com',
    'instance'  : 'c0TPJtvFbztuS2p7NhZN3oZz',
    'widget'    : 'c0TPJzF6ztq0WjezxwPEC5W8',
    'appname' : ''
  },
  "fhditch": {
    "host" : "e104-ditchman-stg-01.feedhenry.net",
    "port" : 8443
  }
};


module.exports = {

  // TODO: following tests are quite brittle as they rely on the VNV ditch server being up..
  // However, its the only way to really test it..
//  'test fh.db': function(test, assert) {
//    process.env.FH_USE_LOCAL_DB = true;
//    var logger = { warn : function(){ console.log(arguments); }};
//    cfg.logger = logger;
//    var fhserver = new fhs.FHServer(cfg, logger);
//
//    fhserver.db({
//      "act" : "create",
//      "type" : "myFirstEntity",
//      "fields" : {
//        "firstName" : "Joe",
//        "lastName" : "Bloggs",
//        "address1" : "22 Blogger Lane",
//        "address2" : "Bloggsville",
//        "country" : "Bloggland",
//        "phone" : "555-123456"
//      }
//    }, function(err, res){
//      assert.equal(err, null, "Err not null: " + util.inspect(err));
//      console.log('created');
//
//      fhserver.db({
//        "act": "list",
//        "type": "myFirstEntity"
//      }, function(err, res){
//        assert.equal(err, null, "Err not null: " + util.inspect(err));
//
//        fhserver.db({
//          "act" : "read",
//          "type" : "myFirstEntity",
//          "guid" : res.guid
//        }, function(err, res){
//          assert.equal(err, null, "Err not null: " + util.inspect(err));
//
//          fhserver.db({
//            "act" : "update",
//            "type" : "myFirstEntity",
//            "guid" : res.guid,
//            "fields": {
//              "fistName": "Jane",
//            }}, function(err, res) {
//            assert.equal(err, null, "Err not null: " + util.inspect(err));
//
//            fhserver.db({
//              "act" : "delete",
//              "type" : "myFirstEntity",
//              "guid" : res.guid
//            }, function(err, res){
//              assert.equal(err, null, "Err not null: " + util.inspect(err));
//              test.finish();
//            }); // end delete
//          }); // end update
//        }); // end read
//      }); // end list
//    }); // end create
//  }
};
