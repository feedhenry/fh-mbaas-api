// Copyright (c) FeedHenry 2011

var util = require('util'),
actMock, fhs, fhsConfig, $fh;

module.exports = {
  setUp : function(test, assert){
    actMock = require('./fixtures/act');
    $fh = require("../lib/api.js");
    test.finish();
  },
  'test dev $fh.act': function(test, assert) {
    $fh.act({
      guid: "123456789erghjtrudkirejr",
      endpoint: "doSomething",
      params: {
        somekey: "someval"
      }
    }, function(err, data) {
      assert.ok(!err, 'Error: ' + err);
      assert.ok(data);
      test.finish();
    });
  },
  'test live $fh.act': function(test, assert) {
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
      test.finish();
    });
  },
  'test $fh.act bad args': function(test, assert) {
    var gotException = false;
    try {
      $fh.act({});
    } catch (x) {
      gotException = true;
    }
    assert.equal(gotException, true);
    test.finish();
  },
  'test $fh.call sys info ping' : function(test, assert){
    $fh.call('sys/info/ping', {}, function(err, res){
      assert.ok(!err, 'Error: ' + err);
      assert.ok(res.status === 200);
      assert.ok(JSON.parse(res.body).ok === true);
      test.finish();
    });
  },
  'test $fh.call bad arguments url' : function(test, assert){
    $fh.call('fefe', {}, function(err, res){
      if (res){
        assert.ok(res.status === 503);
        assert.ok(res.body.indexOf('Service Temporarily Unavailable')>-1);
      }else{
        assert.ok(err, 'Err was not populated - err is ' + JSON.stringify(err) + ' and res is ' + JSON.stringify(res));
      }
      test.finish();
    });
  },
  tearDown : function(test, assert){
    actMock.done();
    test.finish();
  }
};