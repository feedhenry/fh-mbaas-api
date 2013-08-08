// Copyright (c) FeedHenry 2011

var util = require('util'),
request = require('request'),
fhs = require("../lib/apis.js"),
fhsConfig = require('./fixtures/fhsConfig'),
fhserver = new fhs.FHServer(fhsConfig.cfg, fhsConfig.logger);

module.exports = {
  'test fh.feed() ': function(test, assert) {

    request.post(process.env.FH_TEST_HOSTNAME + '/cloud/getFeed/',{
      headers : {
        'Content-Type' : 'application/json'
      }
    }, function(err, res, body){
      assert.ok(!err);
      var out = JSON.parse(body);
      assert.equal(out.list.length, 10);
      test.finish();

    });
  },
  'test fh.feed() bad args': function(test, assert) {
    var gotException = false;
    try {
      fhserver.feed({});
    } catch (x) {
      gotException = true;
    }
    assert.equal(gotException, true);
    test.finish();
  }
};
