// Copyright (c) FeedHenry 2011

var util = require('util');
var assert = require('assert');
var request = require('request');


module.exports = {
  // BIG TODO - very brittle - refactor with test millicore or dynamically get ids, cookie, etc
//  'test fh.feed() ': function(test, assert) {
//    request.post(process.env.FH_TEST_HOSTNAME + '/cloud/getFeed/',{
//      headers : {
//        'Content-Type' : 'application/json'
//      }
//    }, function(err, res, body){
//      console.log(arguments);
//      assert.ok(!err);
//      var out = JSON.parse(body);
//      assert.equal(out.list.length, 10);
//      test.finish();
//    });
//  },
//  'test fh.feed() bad args': function() {
//    var gotException = false;
//    try {
//      fhserver.feed({});
//    } catch (x) {
//      gotException = true;
//    }
//    assert.equal(gotException, true);
//  }
};
