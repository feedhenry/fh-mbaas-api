var util = require('util'),
  url = require('url'),
  assert = require('assert'),
  http = require('http'),
  https = require('https'),
  futils = require('./fhutils'),
  fhutils, call, config, widget;

module.exports = function(cfg) {
  if (!cfg) {
    return;
  }
  config = cfg;
  widget = config.fhapi.widget;
  fhutils = new futils(cfg);
  call = require('./call')(cfg);
  return act();
};

/**
 * description: fh.act is the server side equivilant of the client side $fh.act.
 * It allows one app to call anothers endpoints which means several apps can share the same
 * state information held by another app
 * @param params {guid:"",endpoint:"",params:{}}
 * @param cb function
 */
var act = function() {
  //private set up stuff
  var ERRORS = {
    "InvalidCallback": "$fh.act requires the final parameter to be a function",
    "InvalidArgument": "The param %s is invalid it is required to be a %s",
    "MissingArgument": "The param %s is missing",
    "MissingParms": "params is missing",
    "InvalidGuid": "The app identifier (guid) is invalid %s . Please check it.",
    "AppNotFound": "No app with identifier %s found. Please ensure the identifier is correct"
  };

  function validateParams(params, cb) {
    if (!params || 'object' !== typeof params) {
      return cb(ERRORS.MissingParms);
    }
    if (!params.hasOwnProperty('guid') || 'string' !== typeof params.guid) {
      return cb(util.format(ERRORS.InvalidArgument, "guid", "string"));
    }
    if (params.guid.length !== 24) {
      return cb(util.format(ERRORS.InvalidGuid, params.guid));
    }
    if (!params.hasOwnProperty('endpoint') || 'string' !== typeof params.endpoint) {
      return cb(util.format(ERRORS.InvalidArgument, "endpoint", "string"));
    }
    if (params.hasOwnProperty('params') && 'object' !== typeof params['params']) {
      return cb(util.format(ERRORS.InvalidArgument, "params", "object"));
    }
    return cb(null);
  }

  function doAppCall(endpoints, func, params, liveflag, cb) {
    if ('object' !== typeof endpoints || endpoints.status !== 200) return cb(util.format(ERRORS.AppNotFound, params.guid));
    var retdata = JSON.parse(endpoints['body']);
    var callurl = (liveflag) ? retdata['hosts']['live-url'] : retdata['hosts']['development-url'];
    callurl += "/cloud/" + func;
    var payload = "";
    try {
      payload = JSON.stringify(params);
    } catch (e) {
      return cb(" Could not send params " + e.message);
    }
    var urlprops = url.parse(callurl);
    //sometimes there is a port appended to the host url
    var portmatch = urlprops.host.match(/[:\d]*$/);
    var port = (portmatch === null) ? 443 : portmatch[0].toString().replace(/:/, "");
    urlprops.host = urlprops.host.replace(/[:\d]*$/, "");
    var headers = {};
    headers["content-type"] = "application/json";
    headers["content-length"] = new Buffer(payload).length || 0;
    headers["accept"] = "application/json";
    headers["x-request-with"] = widget;
    fhutils.addAppApiKeyHeader(headers);

    var opts = {
      host: urlprops.host,
      path: urlprops.path,
      port: port,
      method: "POST",
      headers: headers
    };

    var protocol = (urlprops.protocol === "http") ? http : https;

    //finally make call to other app
    var req = protocol.request(opts, function(res) {
      req.socket && req.socket.setTimeout(60000);
      req.connection.setTimeout && req.connection.setTimeout(60000);
      var retData = "";
      res.on('data', function(data) {
        retData += data;
      });
      res.on('end', function() {
        return cb(null, retData);
      });
    });
    req.on('error', function(err) {
      return cb(err);
    });
    req.write(payload);
    req.end();
  }

  //return our public function
  return function(params, cb) {
    if ('function' !== typeof cb) throw {
      name: "InvalidCallback",
      message: ERRORS.InvalidCallback
    };
    validateParams(params, function(err) {
      if (err) return cb(err);
      //call millicore hosts endpoint sending the guid of app being called and the guid of the app doing the calling
      call("ide/apps/app/hosts", {
        payload: {
          "guid": params.guid,
          calling_guid: widget
        }
      }, function(err, data) {
        //construct our call to secondary app
        if (err) return cb(err);
        var live = (params.live) ? true : false;
        var funcParams = params.params || {};
        doAppCall(data, params.endpoint, funcParams, live, cb);
      });
    });
  };
};