// Copyright (c) FeedHenry 2011

var util = require('util');
var async = require('async');
var request = require('request');
var $fh = require("../lib/apis.js");

module.exports = {

  'test caching in fh': function(test, assert) {
    var d1, d2;
    request.post(process.env.FH_TEST_HOSTNAME + '/cloud/getTime/', {
      method : 'POST',
      json : {},
      headers : {
        'Content-Type' : 'application/json'
      }
    }, function(err, res, data) {
      d1 = data;
      assert.ok(!err);
      assert.ok(res.statusCode === 200);
      assert.ok(d1!==null);
      request.post(process.env.FH_TEST_HOSTNAME + '/cloud/getTime/', {
        json : {},
        headers : {
          'Content-Type' : 'application/json'
        }
      }, function(err, res, data) {
        d2 = data;
        assert.ok(!err);
        assert.ok(res.statusCode === 200);
        assert.ok(data !== null);
        assert.equal(d1, d2);
        request.post(process.env.FH_TEST_HOSTNAME + '/cloud/clearTime/', {
          json : {},
          headers : {
            'Content-Type' : 'application/json'
          }
        }, function(err, res, data) {
          assert.ok(!err);
          assert.ok(res.statusCode === 200);
          assert.notEqual(data, null);
          test.finish();
        });

      });
    });
  }
};
