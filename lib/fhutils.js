var assert = require('assert'),
appapikey;

module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  this.addAppApiKeyHeader = function(header){
    if(cfg.fhapi && cfg.fhapi.appapikey && cfg.fhapi.appapikey.length > 0){
      header[cfg.APP_API_KEY_HEADER] = cfg.fhapi.appapikey;
    }
  };

  this.getMillicoreProps = function(){
    var props = {};
    if (cfg && cfg.fhapi) {
      return cfg.fhapi;
    }
    return props;
  };
};
