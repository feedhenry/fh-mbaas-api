var $fh = require("../../lib/apis.js"),
async = require('async');
exports.doFhStat = function(params, callback) {
  var i=0;
  var counters = ['foo', 'bar', 'bob', 'alice', 'jack'];

  async.whilst(function() { return i<100;}, function(cb){
    var rand = Math.floor(Math.random() * counters.length);
    i++;

    async.parallel([
      function(pcb){
        // random counter inc
        $fh.stats.inc(counters[rand], function(err){
          pcb(err);
        });
      },
      function(pcb){
        // random counter dec
        rand = Math.floor(Math.random() * counters.length);
        $fh.stats.dec(counters[rand], function(err){
          pcb(err);
        });
      },
      function(pcb){
        // random timing
        rand = Math.floor(Math.random() * 101);
        $fh.stats.timing("task1", rand, function(err){
          pcb(err);
        });
      }
    ],function(err, results){
      return callback(err, {result: 'ok'});
    });
  });
};