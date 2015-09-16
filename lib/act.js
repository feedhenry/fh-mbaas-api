var util = require('util'),
  url = require('url'),
  path = require('path'),
  assert = require('assert'),
  request = require('request'),
  futils = require('./fhutils'),
  optval = require('optval'),
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
    "AppNotFound": "No app with identifier %s found. Please ensure the identifier is correct",
    "HostNotFound": "Unable to determine hostname for target app %s"
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
    if (params.hasOwnProperty('params') && 'object' !== typeof params['params']) {
      return cb(util.format(ERRORS.InvalidArgument, "params", "object"));
    }
    if( ! (params.hasOwnProperty('path') || params.hasOwnProperty('endpoint') ) )  {
      return cb('Either "path" or "endpoint" is required.')
    }
    return cb(null);
  }

  function doAppCall(callurl, actParams, reqParams, cb) {

    callurl = url.parse(callurl);

    var urlStr = url.format({
      host: callurl.host,
      protocol: callurl.protocol,
      pathname: (actParams.path) ?
        path.join(callurl.pathname, actParams.path) :
        path.join(callurl.pathname, 'cloud', actParams.endpoint)
    });

    var headers = optval(actParams.headers, {});
    headers["accept"] = "application/json";
    headers["x-request-with"] = widget;
    fhutils.addAppApiKeyHeader(headers);

    var reqOpts = {
      url : urlStr,
      headers: headers,
      method: optval(actParams.method, "POST"),
      timeout: optval(actParams.timeout, 60000),
      json: optval(actParams.json, true)
    };

    if( reqOpts.method === 'GET') {
      reqOpts.qs = reqParams;
    } else {
      reqOpts.json =  reqParams;
    }

    request(reqOpts , function (error, response, body) {
      return cb(error, body, response);  // would prefer the same order as request, but maintaining backward compatibility with earlier flawed api
    });

  }

  //return our public function
  return function(params, cb) {
    if ('function' !== typeof cb) throw {
      name: "InvalidCallback",
      message: ERRORS.InvalidCallback
    };
    validateParams(params, function(err) {

      if (err) return cb(err);
      var funcParams = params.params || {};

      if (process.env.FH_SERVICE_MAP) {
        // For local development, we will provide the service <==> hostname:port mapping in gruntfile.
        // console.log('LOCAL service map : ', util.inspect(process.env.FH_SERVICE_MAP))

        var hasUrl = false;
        try {
          var serviceMap = JSON.parse(process.env.FH_SERVICE_MAP);
          if (serviceMap[params.guid]) {
            hasUrl = true;
          }
          else {
            return cb('Unable to find mapping for guid ' + params.guid + '  in service map from FH_SERVICE_MAP environment variable');
          }
        } catch (e) {
          return cb('Unable to parse local service map from FH_SERVICE_MAP environment variable');
        }

        // Do the HTTP request outside of the try catch block so that any errors are raised correctly and not swallowed by the catch block
        if( hasUrl ) {
          doAppCall(serviceMap[params.guid], params, funcParams, cb);
        }
      }
      else {
        //For non local development we need to call core platform, sending the guid of app being called and the guid of the app doing the calling and the environment
        call("ide/apps/app/hosts", {
          payload: {
            "guid": params.guid,
            "calling_guid": widget,
            "env" : process.env.FH_ENV
          }
        }, function(err, res) {
          if (err) return cb(err);

          if ('object' !== typeof res || res.status !== 200) return cb(util.format(ERRORS.AppNotFound, params.guid));
          var resData = JSON.parse(res['body']);
          var callurl;

          if( resData['hosts']) {
            if(resData['hosts']['url']) {
              // Use the generic URL if available - this caters for full lifecycle management
              callurl = resData['hosts']['url'];
            } else {
              var live = (params.live) ? true : false;
              callurl = (live) ? resData['hosts']['live-url'] : resData['hosts']['development-url'];
            }
            doAppCall(callurl, params, funcParams, cb);
          } else {
            return cb(util.format(ERRORS.HostNotFound, params.guid));
          }
        });
      }
    });
  };
};
