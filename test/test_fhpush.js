// Copyright (c) FeedHenry 2011
var util = require('util'),
sDeviceToken = "FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660",
$fh;

module.exports = {
  'test fh.push': function(test, assert) {
    $fh = require("../lib/api.js");
    $fh.push({
      act : "register",
      type: "dev",
      params: {id: sDeviceToken, platform: 'ios'}
    }, function(err, res){
      assert.equal(err, null, "Err not null: " + util.inspect(err));
      assert.equal(res.status, 200, "Unexpected response from register: " + util.inspect(res));
      assert.equal(res.result, 'OK', "Unexpected result from register: " + util.inspect(res));

      $fh.push({
        act : "push",
        type: "dev",
        params: {device_tokens: [sDeviceToken], aps: {alert:'test push'}}
      }, function(err, res){
        assert.equal(err, null, "Err not null: " + util.inspect(err));
        assert.equal(res.status, 200, "Unexpected response from push: " + util.inspect(res));
        assert.ok(res.result['push_id']);
        var android_message = {'android':{'alert': 'test broadcast'}};
        $fh.push({
          act : "broadcast",
          type: "dev",
          params: android_message
        }, function(err, res){
          assert.equal(err, null, "Err not null: " + util.inspect(err));
          assert.equal(res.status, 200, "Unexpected response from broadcast: " + util.inspect(res));
          assert.ok(res.result['push_id']);
          test.finish();
        });
      });
    });
  }
};
