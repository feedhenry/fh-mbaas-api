var request = require('request'),
  fs = require('fs'),
  util = require('util'),
  mongodbUri = require('mongodb-uri'),
  assert = require('assert'),
  futils = require('./fhutils'),
  logger,
  appname,
  config,
  ditch_host,
  fhutils,
  ditch_port;

// if we're running on OpenShift, then ensure that our FH_MONGODB_CONN_URL envvar is set when the module is loaded
// Some client apps e.g. Our generic Welcome app, use the presense of the envvar to indicate whether direct database calls can be made
// Support for openshift 2 (on the left )& 3 (on the right)
// Support for openshift 2 (on the left )& 3 (on the right)
if (process.env.OPENSHIFT_MONGODB_DB_HOST || process.env.MONGODB_SERVICE_HOST) {
  var connectionString,
    host = process.env.OPENSHIFT_MONGODB_DB_HOST || process.env.MONGODB_SERVICE_HOST,
    user = process.env.OPENSHIFT_MONGODB_DB_USERNAME || process.env.MONGODB_USER,
    pass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || process.env.MONGODB_PASSWORD,
    port = process.env.OPENSHIFT_MONGODB_DB_PORT || process.env.MONGODB_SERVICE_PORT,
    dbname = process.env.OPENSHIFT_APP_NAME || process.env.MONGODB_DATABASE;
  
  connectionString = mongodbUri.format({
    username: user,
    password: pass,
    hosts: [
      {
        host: host,
        port: port
      }
    ],
    database: dbname,
  });
  process.env.FH_MONGODB_CONN_URL = connectionString;
}

module.exports = function (cfg) {
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
var db = function (params, callback) {
  if (!params.act) throw new Error("'act' undefined in params. See documentation of $fh.db for proper usage");
  // Type required for all but list operations, where we can list collections by omitting the type param
  if (!(params.type) && ['close', 'list', 'export', 'import'].indexOf(params.act) === -1) throw new Error("'type' undefined in params. See documentation of $fh.db for proper usage");
  if (!appname) throw new Error("Internal error - no appId defined");


  params.__fhdb = appname;

  //If there is a mongo connection url, then the one-db-per-app parameter must be set for the request
  //to alert ditcher the app has its own database.
  if (process.env.FH_MONGODB_CONN_URL) {
    params.__dbperapp = appname;
  }

  var fhdb = require('fh-db');
  if (process.env.FH_USE_LOCAL_DB || process.env.FH_MONGODB_CONN_URL) {
    return fhdb.local_db(params, callback);
  }
  else {
    //net_db should not be called by apps created using fh-webapp --
    if (process.env.FH_DB_PERAPP) {
      return callback(new Error("Data storage not enabled for this app. Please use the Data Browser window to enable data storage."));
    } else {
      return net_db(params, callback);
    }
  }
};

function net_db(params, callback) {
  var headers = {"accept": "application/json"},
    url = config.fhditch.protocol + "://" + ditch_host + ":" + ditch_port + '/data/' + params.act,
    postData = {
      uri: url,
      method: 'POST',
      headers: headers,
      timeout: config.socketTimeout
    },
    req,
    requestArgs;
  headers["content-type"] = "application/json";
  fhutils.addAppApiKeyHeader(headers);

  // Otherwise, these get sent as form data
  if (!params.files) {
    postData.json = params;
  }

  requestArgs = [postData];

  if (params.act !== 'export') {
    // Only export requests get streamed - the rest use the normal callback mehcanism
    requestArgs.push(function (err, res, body) {
      if (err) {
        logger.warning('Problem contacting DITCH server: ' + err.message + "\n" + util.inspect(err.stack));
        return callback(err);
      }
      return callback(null, body);
    });
  }

  req = request.apply(this, requestArgs);

  // if we're sending files, setup the request to use form data
  if (params.files) {
    var form = req.form();
    Object.keys(params.files).forEach(function (filekey) {
      var file = params.files[filekey];
      form.append(filekey, fs.createReadStream(file.path));
    });
    // Append all strings as form data
    Object.keys(params).forEach(function (paramkey) {
      var paramData = params[paramkey];
      if (typeof paramData === 'string') {
        form.append(paramkey, paramData);
      }
    });
  }

  if (params.act === 'export') {
    // Finish up a streaming request for exports
    req.on('error', function (err) {
      logger.warning('Problem contacting DITCH server: ' + err.message + "\n" + util.inspect(err.stack));
      return callback(err);
    })
    req.end();

    return callback(null, {stream: req});
  }
  return;


}
