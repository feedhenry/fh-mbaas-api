exports.logger = { warn : function(){ console.log(arguments); }, warning : function(){ console.log(arguments);  }};
exports.cfg = {
  "fhnodeapp" :
    {
      'millicore' : 'localhost',
      'instance'  : 'c0TPJtvFbztuS2p7NhZN3oZz',
      'widget'    : 'c0TPJzF6ztq0WjezxwPEC5W8',
      'appname' : '123'
    },
    "fhditch": {
      "host" : "localhost",
      "port" : 8802
    },
    "urbanairship": {
      "ua_push_enabled" : true,
      "ua_push_dev_app_key" : '9z95CMpCTLavGrgga-SYPA',
      "ua_push_dev_app_secret" : 'FpF3-38lQteTQcTRYhtcGg',
      "ua_push_dev_master_secret" : 'STS8wrN8QzyHKxm7PM953w',
      "ua_push_prod_app_key" : '',
      "ua_push_prod_app_secret_key" : '',
      "ua_push_prod_app_master_secret_key" : ''
    },
    logger : exports.logger
};