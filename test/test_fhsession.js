//tests for fh.session
var util = require('util'),
fhs = require("../lib/apis.js"),
fhsConfig = require('./fixtures/fhsConfig'),
fhserver = new fhs.FHServer(fhsConfig.cfg, fhsConfig.logger),
async = require('async'),
session = JSON.stringify({
  "sessionId":"mysession"
});
module.exports = {

  "test session no timeout":function (test, assert) {

    fhserver.session.set("mysession", session, 0, function (err, suc) {
      assert.ok(!err);
      assert.equal("mysession", suc);
      fhserver.session.get("mysession", function (err, sess) {
        assert.ok(!err);
        assert.isDefined(sess);
        fhserver.session.remove("mysession", function (err, suc) {
          assert.ok(!err);
          assert.equal(true,suc);
          test.finish();
        });
      });
    });
  },

  "test session with timeout":function (test, assert) {
    //set session to expire in 2 secs
    fhserver.session.set("timeoutsession", session, 2, function (err, suc) {
      assert.ok(!err);
      assert.equal("timeoutsession", suc);
      fhserver.session.get("timeoutsession", function (err, data) {
        assert.ok(!err);
        assert.isDefined(data);
        setTimeout(function () {
          fhserver.session.get("timeoutsession", function (err, sess) {
            assert.ok(!err);
            assert.equal(null, sess);
            test.finish();
          });
        }, 4000);
      });
    });
  },

  "test retrieving cache from session":function (test, assert) {
    fhserver.cache({act:'save', key:'testkey', value:'cheeky'}, function (err, data) {
      //stored value now try and retrieve through fhserver.session
      if (err)console.log("error storing in cache");
      fhserver.session.get('testkey', function (err, data) {
        assert.ok(!err);
        assert.equal(null, data);
        test.finish();
      });
    });
  },

  "test errors on bad params":function (test, assert) {
    try {
      fhserver.session.get("mybadparam");
    } catch (e) {
      assert.equal("InvalidCallbackException", e.type);
      test.finish();
    }
  }
};