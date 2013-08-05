
// Copyright (c) FeedHenry 2011
//
// fhserver - the node.js implementation of FeedHenryServer
//
var sec = require('fh-security');

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
    web : false,
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
    sync: require('./sync-srv.js'),
    act : require('./act')(cfg),
    sec: sec.security,
    hash: function(opts, callback){
      var p = {act:'hash', params: opts};
      sec.security(p, callback);
    }
  };
}

exports.FHServer = FHServer;
