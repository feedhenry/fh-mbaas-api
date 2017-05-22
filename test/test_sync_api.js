// Copyright (c) FeedHenry 2011
var util = require('util');
var async = require("async");
var assert = require('assert');
var fh;

exports.test_sync_api =  function(finish) {
  var fh = require("../lib/api.js");
  assert.ok(fh.sync, 'Missing sync api');
  assert.ok(fh.sync.connect);
  assert.ok(fh.sync.handleCreate);
  assert.ok(fh.sync.handleRead);
  assert.ok(fh.sync.handleList);
  assert.ok(fh.sync.listCollisions);
  finish();
}
