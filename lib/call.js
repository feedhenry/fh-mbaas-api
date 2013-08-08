var config,
_ = require('underscore'),
https = require('https'),
futils = require('./fhutils'),
fhutils;
module.exports = function(cfg){
  config = cfg;
  fhutils = new futils(config);
  return call;
};

//
// $fh.call() : Call back to millicore from our Node.js code.
// NOT a public function but may be one day.
// TODO - this seems to be unsed!
//      - verify and remove
//      - also note that it uses hardcoded https here.
var call = function call(path, params, callback) {
  var headers = { "accept" : "application/json" },
  logger = config.logger;
  var props = fhutils.getMillicoreProps();
  headers["content-type"] = "application/json";
  fhutils.addAppApiKeyHeader(headers);

  var options = {
    host: props.millicore,
    port: 443,
    path: '/box/srv/1.1/' + path,
    method: 'POST',
    headers: headers
  };

  var addParams = (params == undefined || params == null)? new Object() : _.clone(params);
  addParams["instance"] = props.instId;
  addParams["widget"] =  props.widgId;

  var fhResp = new Object();
  var req = https.request(options, function (res) {
    fhResp.status = res.statusCode;
    // TODO - *both* of these are recommended ways of setting timeout on http requests..
    // needs further investigation (and proper test case!!)
    req.socket && req.socket.setTimeout(60000);  // TODO - timeout should be configurable!
    req.connection.setTimeout && req.connection.setTimeout(60000);
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      fhResp.body = data;
      callback(undefined, fhResp);
    });
  });

  req.on('error', function(e) {
    logger.warning('Problem invoking: ' + e.message);
    callback(e);
  });

  req.write(JSON.stringify(addParams)+"\n");
  req.end();
};