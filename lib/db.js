var http = require('http'),
https = require('https'),
util = require('util'),
assert = require('assert'),
futils = require('./fhutils'),
logger,
appname,
config,
ditch_host,
fhutils,
ditch_port;

module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  config = cfg;
  logger = cfg.logger;
  appname = cfg.fhapi.appname;
  fhutils = new futils(config);
  // Ditch settings
  if (cfg && cfg.fhditch) {
    if (cfg.fhditch.host) ditch_host = cfg.fhditch.host;
    if (cfg.fhditch.port) ditch_port = cfg.fhditch.port;
  }
  return db;
};

// $fh.db
var db = function(params, callback) {
  if (params.act == undefined) throw new Error("'act' undefined in params. See documentation of $fh.db for proper usage");
  // Type required for all but list operations, where we can list collections by omitting the type param
  if (params.act !== 'list' && params.type == undefined) throw new Error("'type' undefined in params. See documentation of $fh.db for proper usage");
  if (appname == undefined) throw new Error("Internal error - no appId defined");


  
  params.__fhdb = appname;
  //If there is a mongo connection url, then the one-db-per-app parameter must be set for the request
  //to alert ditcher the app has its own database.
  if(process.env.FH_MONGODB_CONN_URL){
    params.__dbperapp = appname;
  }
  var fhdb = require('fh-db');
  if(process.env.FH_USE_LOCAL_DB || process.env.FH_MONGODB_CONN_URL) {
    return fhdb.local_db(params, callback);
  }
  else {
    //net_db should not be called by apps created using fh-webapp --
    if(process.env.FH_DB_PERAPP){
      return callback(new Error("Data storage not enabled for this app. Please use the Data Browser window to enable data storage."));
    }else{
      return net_db(params, callback);
    }
  }
};

function net_db(params, callback) {
  var headers = { "accept" : "application/json" };
  headers["content-type"] = "application/json";
  fhutils.addAppApiKeyHeader(headers);

  var options = {
    host: ditch_host,
    port: ditch_port,
    path: '/data/' + params.act,
    method: 'POST',
    headers: headers
  };
  var protocol = (config.fhditch.protocol === "http")? http : https;
  var req = protocol.request(options, function (res) {


    req.socket && req.socket.setTimeout(config.socketTimeout);
    req.connection.setTimeout && req.connection.setTimeout(config.socketTimeout);
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      if (res.statusCode != 200) {
        return callback(new Error(data + " status: " + res.statusCode));
      }
      return callback(undefined, JSON.parse(data));
    });
  });

  req.on('error', function(e) {
    logger.warning('Problem contacting DITCH server: ' + e.message + "\n" + util.inspect(e.stack));
    callback(e);
  });

  req.write(JSON.stringify(params)+"\n");
  req.end();

}
