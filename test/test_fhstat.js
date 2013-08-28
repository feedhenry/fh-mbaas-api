// Copyright (c) FeedHenry 2011
var util = require('util'),
async = require("async"),
$fh;

module.exports = {

  'test fh.stats()' : function(test, assert) {
    $fh = require("../lib/api.js");
    //var fhStats = fhs.stats({enabled:true});
    var i = 0;
    var counters = ['foo', 'bar', 'bob', 'alice', 'jack'];

    async.whilst(function() { return i<100;}, function(cb){
    var rand = Math.floor(Math.random() * counters.length);
    i++;

    // random counter inc
    $fh.stats.inc(counters[rand], function(err, bytes){
    assert.ok(!err, 'Error: ' + err);
     // random counter dec
     rand = Math.floor(Math.random() * counters.length);
     $fh.stats.dec(counters[rand], function(err, bytes){
       assert.ok(!err, 'Error: ' + err);
       // random timing
       rand = Math.floor(Math.random() * 101);
       $fh.stats.timing("task1", rand, function(err, bytes){
         assert.ok(!err, 'Error: ' + err);
         cb();
       });
     });
    });

   }, function(err){
   assert.isUndefined(err, "Unexpected err: " + util.inspect(err));
     test.finish();
     //fhStats.close();
   });


   }
};
