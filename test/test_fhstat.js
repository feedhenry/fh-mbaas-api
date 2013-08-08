// Copyright (c) FeedHenry 2011
var util = require('util'),
fhs = require('../lib/apis.js'),
request = require('request'),
fhsConfig = require('./fixtures/fhsConfig'),
async = require("async");

module.exports = {

   'test fh.stats()' : function(test, assert) {
   var $fh = new fhs.FHServer(fhsConfig.cfg, fhsConfig.logger);
   //var fhStats = fhs.stats({enabled:true});
   var i = 0;
   var counters = ['foo', 'bar', 'bob', 'alice', 'jack'];

   async.whilst(function() { return i<100;}, function(cb){
   var rand = Math.floor(Math.random() * counters.length);
   i++;

   // random counter inc
   $fh.stats.inc(counters[rand], function(err, bytes){
    assert.ok(!err);
     // random counter dec
     rand = Math.floor(Math.random() * counters.length);
     $fh.stats.dec(counters[rand], function(err, bytes){
       assert.ok(!err);
       // random timing
       rand = Math.floor(Math.random() * 101);
       $fh.stats.timing("task1", rand, function(err, bytes){
         assert.ok(!err);
         cb();
       });
     });
   });

   }, function(err){
   assert.isUndefined(err, "Unexpected err: " + util.inspect(err));
     test.finish();
     //fhStats.close();
   });


   },

  'test fh.stats() from script' : function(test, assert) {
    request.post(process.env.FH_TEST_HOSTNAME + '/cloud/doFhStat/',{
      json : {},
      headers : {
        'Content-Type' : 'application/json'
      }
    }, function(err, res, body){
      assert.equal(200, res.statusCode, "Unexpected response from doFhStat: " + util.inspect(res.body));
      assert.ok(body.result === 'ok');
      test.finish();
    });
  }
};
