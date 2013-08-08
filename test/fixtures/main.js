var fhs = require("../../lib/apis.js"),
fhsConfig = require('./../fixtures/fhsConfig'),
$fh = new fhs.FHServer(fhsConfig.cfg, fhsConfig.logger),
async = require('async');

exports.getFeed = function(params, callback) {

};

exports.getTime = function(params, callback) {
  $fh.cache({act:'load', key: 'time'}, function (err, cachedTime) {
    if (err) return callback(err, null);
    var currentTime = Date.now();

    if (cachedTime == null || (parseInt(cachedTime) + 10000) < currentTime) {
      $fh.cache({act: 'save', key: 'time', value: JSON.stringify(currentTime)}, function (err) {
        return callback(err, new Date(currentTime));
      });
    }else
      return callback(null, new Date(parseInt(cachedTime)));
  });
};

exports.clearTime = function(params, callback) {
  $fh.cache({act:'remove', key: 'time'}, function (err, data) {
    return callback(err, data);
  });
};

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