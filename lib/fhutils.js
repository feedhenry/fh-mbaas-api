var appapikey;

module.exports = function(cfg){
  this.addAppApiKeyHeader = function(header){
    if(cfg.appapikey && cfg.appapikey.length > 0){
      header[APP_API_KEY_HEADER] = cfg.appapikey;
    }
  };

  this.getMillicoreProps = function(){
    var props = {};
    if (cfg && cfg.fhnodeapp) {
      return cfg.fhnodeapp;
    }
    return props;
  };

  this.getUAAppKeys = function(act, type, config) {
    var keys = { appKey : "",  appSecret : ""};
    if (getUAProp(config, 'ua_push_enabled')){
      if (type == "dev"){
        keys.appKey = getUAProp(config, 'ua_push_dev_app_key');
        keys.appSecret = act === "register" ? getUAProp(config, 'ua_push_dev_app_secret') : getUAProp(config, 'ua_push_dev_master_secret');
      } else if("prod" === type){
        keys.appKey = getUAProp(config, 'ua_push_prod_app_key');
        keys.appSecret = act== "register" ? getUAProp(config, 'ua_push_prod_app_secret') : getUAProp(config, 'ua_push_prod_master_secret');
      }
    }
    return keys;
  };

};