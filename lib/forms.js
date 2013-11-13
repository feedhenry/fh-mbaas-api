var http = require('http'),
  https = require('https'),
  util = require('util'),
  assert = require('assert'),
  futils = require('./fhutils'),
  fhforms = require('fh-forms'),
  logger,
  appname,
  config,
  ditch_host,
  fhutils,
  ditch_port;

// $fh.forms...
var forms = {
  "getForms" : fhforms.getForms,
  "getForm" : fhforms.getForm,
  "getTheme" : fhforms.getTheme,
  "submitFormData" : fhforms.submitFormData,
  "submitFormFile" : fhforms.submitFormFile,
  "getSubmissionStatus" : fhforms.getSubmissionStatus,
  "completeSubmission" : fhforms.completeSubmission
};

module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  config = cfg;
  logger = cfg.logger;
  appname = cfg.fhapi.appname;
  fhutils = new futils(config);
  return forms;
};



