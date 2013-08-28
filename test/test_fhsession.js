//tests for fh.session
var util = require('util'),
$fh = require("../lib/api.js"),
async = require('async'),
session = JSON.stringify({
  "sessionId":"mysession"
});
module.exports = {

  "test session no timeout":function (test, assert) {

    $fh.session.set("mysession", session, 0, function (err, suc) {
      assert.ok(!err, 'Error: ' + err);
      assert.equal("mysession", suc);
      $fh.session.get("mysession", function (err, sess) {
        assert.ok(!err, 'Error: ' + err);
        assert.isDefined(sess);
        $fh.session.remove("mysession", function (err, suc) {
          assert.ok(!err, 'Error: ' + err);
          assert.equal(true,suc);
          test.finish();
        });
      });
    });
  },

  "test session with timeout":function (test, assert) {
    //set session to expire in 2 secs
    $fh.session.set("timeoutsession", session, 2, function (err, suc) {
      assert.ok(!err, 'Error: ' + err);
      assert.equal("timeoutsession", suc);
      $fh.session.get("timeoutsession", function (err, data) {
        assert.ok(!err, 'Error: ' + err);
        assert.isDefined(data);
        setTimeout(function () {
          $fh.session.get("timeoutsession", function (err, sess) {
            assert.ok(!err, 'Error: ' + err);
            assert.equal(null, sess);
            test.finish();
          });
        }, 4000);
      });
    });
  },

  "test retrieving cache from session":function (test, assert) {
    $fh.cache({act:'save', key:'testkey', value:'cheeky'}, function (err, data) {
      //stored value now try and retrieve through $fh.session
      if (err)console.log("error storing in cache");
      $fh.session.get('testkey', function (err, data) {
        assert.ok(!err, 'Error: ' + err);
        assert.equal(null, data);
        test.finish();
      });
    });
  },

  "test errors on bad params":function (test, assert) {
    try {
      $fh.session.get("mybadparam");
    } catch (e) {
      assert.equal("InvalidCallbackException", e.type);
      test.finish();
    }
  }
};