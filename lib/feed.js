var call = require('./call'),
cfg;

//
// $fh.feed()
// Same interface as http://docs.feedhenry.com/wiki/Read_Rss_Feed
//

module.exports = function(config){
  cfg = config;
  return cache;
};

var cache = function feed(params, callback) {
  if (callback == undefined) {
    throw new Error('callback undefined in $fh.feed. See documentation of $fh.feed for proper usage');
  }

  this.call(cfg, 'ent/feed/Feed/get_entries', params, callback);
};