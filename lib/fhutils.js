var assert = require('assert'),
appapikey;

module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  var self = this;
  this.addAppApiKeyHeader = function(header){
    if(cfg.appapikey && cfg.appapikey.length > 0){
      header[cfg.APP_API_KEY_HEADER] = cfg.appapikey;
    }
  };

  this.getMillicoreProps = function(){
    var props = {};
    if (cfg && cfg.fhapi) {
      return cfg.fhapi;
    }
    return props;
  };

  this.getUAProp = function(cfg, prop) {
    var ret = undefined;
    if (cfg && cfg.urbanairship && cfg.urbanairship[prop])
      ret = cfg.urbanairship[prop];
    return ret;
  };

  this.getUAAppKeys = function(act, type, config) {
    var keys = { appKey : "",  appSecret : ""};
    if (self.getUAProp(config, 'ua_push_enabled')){
      if (type == "dev"){
        keys.appKey = self.getUAProp(config, 'ua_push_dev_app_key');
        keys.appSecret = act === "register" ? self.getUAProp(config, 'ua_push_dev_app_secret') : self.getUAProp(config, 'ua_push_dev_master_secret');
      } else if("prod" === type){
        keys.appKey = self.getUAProp(config, 'ua_push_prod_app_key');
        keys.appSecret = act== "register" ? self.getUAProp(config, 'ua_push_prod_app_secret') : self.getUAProp(config, 'ua_push_prod_master_secret');
      }
    }
    return keys;
  };



};