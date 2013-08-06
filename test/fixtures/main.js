var logger = { warn : function(){ console.log(arguments); }};
var fh = require('../../lib/apis.js').FHServer({ 'fhnodeapp' : { appname : '' },  logger : logger }, logger);

exports.getFeed = function(params, callback) {
  var opts = { 'link': 'http://www.feedhenry.com/feed', 'list-max': 10};
  fh.feed(opts, function(err, feed) {
    return callback(err, feed.body);

  });
};

exports.getTime = function(params, callback) {
  fh.cache({act:'load', key: 'time'}, function (err, cachedTime) {
    if (err) return callback(err, null);
    var currentTime = Date.now();

    if (cachedTime == null || (parseInt(cachedTime) + 10000) < currentTime) {
      fh.cache({act: 'save', key: 'time', value: JSON.stringify(currentTime)}, function (err) {
        return callback(err, new Date(currentTime));
      });
    }else
      return callback(null, new Date(parseInt(cachedTime)));
  });
};

exports.clearTime = function(params, callback) {
  fh.cache({act:'remove', key: 'time'}, function (err, data) {
    return callback(err, data);
  });
};