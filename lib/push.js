var urbanairship = require('./urbanairship.js'),
assert = require('assert'),
futils = require('./fhutils'),
fhutils, config;

module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  config = cfg;
  fhutils = new futils(config);
  return push;
};

// $fh.push
function push(opts, callback) {

  if (!opts.act) return callback (new Error("Missing required 'act' parameter: " + JSON.stringify(opts)));
  if (!opts.type) return callback (new Error("Missing required 'type' parameter: " + JSON.stringify(opts)));
  if (!opts.params) return callback (new Error("Missing required 'params' parameter: " + JSON.stringify(opts)));

  var appKeys = fhutils.getUAAppKeys(opts.act, opts.type, config);
  var ua = urbanairship.urbanairship(appKeys);

  if ('register' === opts.act) {
    if (!opts.params.id) return callback(new Error("No 'id' parameter specified: " + JSON.stringify(opts.params)));
    if (!opts.params.platform) return callback(new Error("No 'platform' parameter specified: " + JSON.stringify(opts.params)));
    ua.doRegistration(opts.params.platform, opts.params.id, callback);
  } else if ('push' === opts.act) {
    ua.doPush(opts.params, callback);
  } else if ('broadcast' === opts.act) {
    ua.doBroadcast(opts.params, callback);
  } else return callback(new Error("Unknown action: '" + opts.act + "'"));
};