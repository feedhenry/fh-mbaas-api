var ups = require("./ups"),
  assert = require('assert'),
  futils = require('./fhutils'),
  sender;

module.exports = function (cfg) {
  assert.ok(cfg, 'cfg is undefined');
  var fhutils = new futils(cfg);

  var props = fhutils.getMillicoreProps(),
    header = {};
  fhutils.addAppApiKeyHeader(header);
  var settings = {
    url: props.millicore + ':' + props.port + '/box/srv/1.1/',
    applicationId: props.instId,
    masterSecret: props.widgId,
    headers: header
  };

  sender = ups.Sender(settings);
  return push;
};

// $fh.push
function push(message, options, callback) {
  if (!message) return callback(new Error("Missing required 'message' parameter: " + JSON.stringify(message)));

  sender.send(message, options, callback);
}