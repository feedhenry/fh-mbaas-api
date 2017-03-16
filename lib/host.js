var _ = require('lodash-contrib'),
  request = require('request'),
  futils = require('./fhutils'),
  assert = require('assert');

module.exports = function(cfg) {
  assert.ok(cfg, 'cfg is undefined');

  var fhutils = new futils(cfg);
  var millicoreProps = fhutils.getMillicoreProps();

  return function host(cb) {
    var url = millicoreProps.protocol + '://' + millicoreProps.millicore + '/box/srv/1.1/ide/apps/app/hosts';
    var data = {
      "guid": process.env.FH_INSTANCE,
      "env": process.env.FH_ENV
    }

    request.post({
      url: url,
      json: true,
      body: data
    }, function (err, res, body) {
      if (err) return cb(err);

      return cb(err, _.getPath(body, "hosts.url"));
    });
  };
}