// Copyright (c) FeedHenry 2011

var util = require('util'),
actMock, fhs, fhsConfig, $fh;
var assert = require('assert');

module.exports = {
  setUp : function(finish){
    actMock = require('./fixtures/act');
    $fh = require("../lib/api.js");
    finish();
  },
  'test act $fh.act url formatting must add leading slash': function (finish) {
    var act = require('proxyquire')('../lib/act.js', {
      'request': function (opts, callback) {
        assert.equal(opts.url, 'https://test.feedhenry.com/user/feedhenry');
        callback(null, {}, 'ok');
      },
      './call': function () {
        return function (url, opts, callback) {
          callback(null, {
            status: 200,
            body: JSON.stringify({
              hosts: {
                url: 'https://test.feedhenry.com'
              }
            })
          });
        };
      }
    })({
      fhapi: {}
    });

    act({
      guid: '123456789erghjtrudkirejr',
      path: 'user/feedhenry'
    }, function (err, body, res) {
      assert.equal(err, null);
      assert.equal(body, 'ok');
      finish();
    });
  },
  'test dev $fh.act': function(finish) {
    $fh.act({
      guid: "123456789erghjtrudkirejr",
      endpoint: "doSomething",
      params: {
        somekey: "someval"
      }
    }, function(err, data) {
      assert.ok(!err, 'Error: ' + err);
      assert.ok(data);
      finish();
    });
  },
  'test live $fh.act': function(finish) {
    $fh.act({
      guid: "123456789erghjtrudkirejr",
      endpoint: "doSomething",
      params: {
        somekey: "someval"
      },
      live : true
    }, function(err, data) {
      assert.ok(!err, 'Error: ' + err);
      assert.ok(data);
      finish();
    });
  },
  'test $fh.act bad args': function(finish) {
    var gotException = false;
    try {
      $fh.act({});
    } catch (x) {
      gotException = true;
    }
    assert.equal(gotException, true);
    finish();
  },
  'test $fh.call sys info ping' : function(finish){
    $fh.call('sys/info/ping', {}, function(err, res){
      assert.ok(!err, 'Error: ' + err);
      assert.ok(res.status === 200);
      assert.ok(JSON.parse(res.body).ok === true);
      finish();
    });
  },
//  'test $fh.call bad arguments url' : function(test, assert){
//    $fh.call('fefe', {}, function(err, res){
//      if (res){
//        assert.ok(res.status === 400);
//        console.log(res.body);
//        assert.ok(res.body.indexOf('Service Temporarily Unavailable')>-1);
//      }else{
//        assert.ok(err, 'Err was not populated - err is ' + JSON.stringify(err) + ' and res is ' + JSON.stringify(res));
//      }
//      test.finish();
//    });
//  },
  tearDown : function(finish){
    actMock.done();
    finish();
  }
};