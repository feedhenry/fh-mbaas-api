var ups = require("./ups"),
  assert = require('assert'),
  futils = require('./fhutils');

module.exports = function (cfg) {
  assert.ok(cfg, 'cfg is undefined');
  var fhutils = new futils(cfg);

  var props = fhutils.getMillicoreProps();
  var headers = {
    'X-Project-Id': props.widget,
    'X-App-Id': props.instance,
  };
  fhutils.addAppApiKeyHeader(headers);
  var settings = {
    url: 'https://' + props.millicore + ':' + props.port + '/box/api/unifiedpush/mbaas/',
    applicationId: "fake", // we have to use fake ID, it will be added by supercore
    masterSecret: "fake", // we have to use fake secret, it will be added by supercore
    headers: headers
  };

  var sender = ups.Sender(settings);
  // $fh.push
  return function push(message, options, callback) {
    if (!message) return callback(new Error("Missing required 'message' parameter: " + JSON.stringify(message)));

    sender.send(message, options, callback);
  }
};

