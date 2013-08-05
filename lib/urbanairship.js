var request = require('request');
var util = require('util');

exports.urbanairship = function(appKeys) {
  var regEndPoint = {
    ios: '/api/device_tokens',
    android: '/api/apids',
    blackberry: '/api/device_pins'
  };

  var format = {
    PLAIN : 0,
    JSON : 1
  };

  var pushServerUrl = "https://<appkey>:<appsecret>@go.urbanairship.com:443";
  var pushEndpoint = "/api/push/";
  var broadcastEndpoint = "/api/push/broadcast/";

  function sendRequest(apiPath, method, data, bodyFormat, callback) {
    var url = pushServerUrl + apiPath;
    url = url.replace('<appkey>', appKeys.appKey);
    url = url.replace('<appsecret>', appKeys.appSecret);

    var req = {url : url, method: method};
    if(bodyFormat == format.JSON) {
      req.json = data;
    }else {
      req.body = data;
    }

    request(req, function (error, response, body) {
      if (error) return callback(error);
      var ret = {status: response.statusCode};
      if (body != null) ret.result = body;
      if(response.statusCode !== 200 && response.statusCode !== 201) {
        ret.error = body;
      }
      return callback(undefined, ret);
    });
  };

  // Urban Airship Registration function
  function doRegistration(platform, id, callback) {
    if(!regEndPoint[platform]) return callback(new Error('No registration endpoint for platform: ' + platform));

    var apiPath = regEndPoint[platform];
    apiPath += "/" + id;
    sendRequest(apiPath, "PUT", JSON.stringify({}), format.PLAIN, callback);
  };

  // Urban Airship Push function
  function doPush(data, callback) {
    sendRequest(pushEndpoint, "POST", data, format.JSON, callback);
  };

  // Urban Airship Broadcast function
  function doBroadcast(data, callback) {
    sendRequest(broadcastEndpoint, "POST", data, format.JSON, callback);
  };

  // Return public functions..
  return {
    doRegistration : doRegistration,
    doPush : doPush,
    doBroadcast : doBroadcast
  };

};
