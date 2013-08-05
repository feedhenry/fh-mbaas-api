var http = require('http'),
https = require('https'),
logger,
appname,
config,
ditch_host,
fhutils = require('./fhutils'),
ditch_port;

module.exports = function(cfg){
  if (!cfg){
    return;
  }
  config = cfg;
  logger = cfg.logger;
  appname = cfg.fhnodeapp.appname;
  fhutils = new fhutils(cfg);
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
  if (params.type == undefined) throw new Error("'type' undefined in params. See documentation of $fh.db for proper usage");
  if (appname == undefined) throw new Error("Internal error - no appId defined");

  params.__fhdb = appname;
  if(process.env.FH_USE_LOCAL_DB) {
    var fhdb = require('fh-db');
    return fhdb.local_db(params, callback);
  } else {
    return net_db(params, callback);
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


    req.socket.setTimeout(60000);  // TODO - timeout should be configurable!
    req.connection.setTimeout(60000);
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
    logger.warning('Problem contacting DITCH server: ' + e.message + "\n" + nodejsutil.inspect(e.stack));
    callback(e);
  });

  req.write(JSON.stringify(params)+"\n");
  req.end();

}