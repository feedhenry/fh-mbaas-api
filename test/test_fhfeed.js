// Copyright (c) FeedHenry 2011

var util = require('util'),
fhs, fhsConfig, $fh, feedMock;

module.exports = {
  'setUp' : function(test, assert){
    feedMock = require('./fixtures/feed'); // needs to go here, as application.js is what requires fh-apis
    fhs = require("../lib/apis.js");
    fhsConfig = require('./fixtures/fhsConfig');
    $fh = new fhs.FHServer(fhsConfig.cfg, fhsConfig.logger);
    test.finish();
  },
  'test fh.feed() ': function(test, assert) {

    var opts = { 'link': 'http://www.feedhenry.com/feed', 'list-max': 10};
    $fh.feed(opts, function(err, feed) {
      assert.ok(!err);
      assert.ok(feed.status);
      feed = JSON.parse(feed.body);
      assert.equal(feed.list.length, 10);
      test.finish();
    });
  },
  'test fh.feed() bad args': function(test, assert) {
    var gotException = false;
    try {
      $fh.feed({});
    } catch (x) {
      gotException = true;
    }
    assert.equal(gotException, true);
    test.finish();
  },
  'tearDown' : function(test, assert){
    feedMock.done();
    test.finish();
  }
};
