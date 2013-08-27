
// Copyright (c) FeedHenry 2011
//
// fhserver - the node.js implementation of FeedHenryServer
//
var sec = require('fh-security'),
consolelogger = require('./consolelogger.js');

//IMPORTANT: This will force node to ignore cert errors for https requests
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//
// Main FHServer constructor function..
//
function FHServer(cfg, logr) {
  var config = cfg;
  if (cfg){
    cfg.logger = logr;
  }

  var ditch_host, ditch_port;


  var APP_API_KEY_HEADER = "X-FH-AUTH-APP";

  return {
    cache: require('./cache')(cfg),
    feed: require('./feed')(cfg),
    db: require('./db')(cfg),
    log: false,
    stringify : false,
    parse : false,
    push: require('./push')(cfg),
    call: require('./call')(cfg),
    util: false,
    redisPort: '1080', //redisPort, // TODO:
    redisHost: '', // redisHost,
    session: require('./session')(cfg),
    stats: require('./stats')(cfg),
    setServer : function setServer(server) {
      // Tidyup when the server we're hosted in is closing
      if(server) {
        server.on('close', function(){
          if (this.fhStats) this.fhStats.close(); // TODO: Fix this ref
        });
      }
    },
    sync: require('./sync-srv.js')(cfg),
    act : require('./act')(cfg),
    sec: sec.security,
    hash: function(opts, callback){
      var p = {act:'hash', params: opts};
      sec.security(p, callback);
    },
    web : require('./web')(cfg)
  };
}

/*
 Initilisation returns the $fh object to clients
 */
module.exports = (function(){
  // First setup the required config params from  env variables
  var millicore = process.env.FH_MILLICORE || 'NO-MILLICORE-DEFINED';
  var domain = process.env.FH_DOMAIN || 'NO-DOMAIN-DEFINED';
  var instance = process.env.FH_INSTANCE || 'NO-INSTANCE-DEFINED';
  var appname = process.env.FH_APPNAME || 'NO-APPNAME-DEFINED';
  var widget = process.env.FH_WIDGET || 'NO-WIDGET-DEFINED';
  var ditch_host = process.env.FH_DITCH_HOST || 'localhost';
  var ditch_port = process.env.FH_DITCH_PORT || 80;
  var ditch_protocol = process.env.FH_DITCH_PROTOCOL || "https";
  var redis_host = process.env.FH_REDIS_HOST || "127.0.0.1";
  var redis_port = process.env.FH_REDIS_PORT || 6379;
  var redis_password = process.env.FH_REDIS_PASSWORD || '';
  var ua = process.env.FH_URBAN_AIRSHIP || '{}';
  var messaging_host = process.env.FH_MESSAGING_HOST || 'NO-MESSAGING-HOST-DEFINED';
  var messaging_cluster = process.env.FH_MESSAGING_CLUSTER || 'NO-MESSAGING-CLUSTER-DEFINED';
  var messaging_server = process.env.FH_MESSAGING_SERVER || 'NO-MESSAGING-SERVER-DEFINED';
  var messaging_recovery_file = process.env.FH_MESSAGING_RECOVERY_FILE || 'NO-RECOVERY-FILE-DEFINED';
  var messaging_protocol  = process.env.FH_MESSAGING_PROTOCOL || "https";
  var messaging_backup_file = process.env.FH_MESSAGING_BACKUP_FILE || 'NO-BACKUP-FILE-DEFINED';
  var stats_host = process.env.FH_STATS_HOST || 'localhost';
  var stats_port = process.env.FH_STATS_PORT || 8125;
  var stats_protocol = process.env.FH_STATS_PROTOCOL || "https";
  var stats_enabled = process.env.FH_STATS_ENABLED || false;
  var appapikey = process.env.FH_APP_API_KEY || '';

  try {
    ua = JSON.parse(ua);
  } catch (x) {
    console.error("Error parsing FH_URBAN_AIRSHIP: " + util.inspect(ua) + " err: " + util.inspect(x));
    ua = {};
  }

  // Now build a config object to init the fh server APIs with

  var cfg = {
    fhnodeapp:{
      appname: appname,
      millicore:millicore,
      domain:domain,
      instance:instance,
      widget:widget,
      appapikey:appapikey
    },
    fhditch:{
      host:ditch_host,
      port:ditch_port,
      protocol : ditch_protocol
    },
    redis:{
      host:redis_host,
      port:redis_port,
      password:redis_password
    },
    fhmessaging:{
      host:messaging_host,
      cluster:messaging_cluster,
      msgServer:{
        logMessageURL:messaging_server
      },
      recoveryFiles:{
        fileName:messaging_recovery_file
      },
      backupFiles:{
        fileName:messaging_backup_file
      },
      protocol : messaging_protocol
    },
    fhstats:{
      host:stats_host,
      port:stats_port,
      enabled:stats_enabled,
      protocol:stats_protocol
    },
    urbanairship:ua
  };

  var logger = new consolelogger.ConsoleLogger(3);
  return new FHServer(cfg, logger);
})();
