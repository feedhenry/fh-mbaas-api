var assert = require('assert'),
  futils = require('./fhutils'),
  fhforms = require('fh-forms'),
  stream = require('stream'),
  async = require('async'),
  _ = require('underscore'),
  logger,
  appname,
  config,
  fhutils

// $fh.forms... cloud api
var checkDomainDatabase = function(cb){
  var domainDbUri = process.env.FH_DOMAIN_DATABASE;
  if(domainDbUri){
    return cb(undefined, domainDbUri);
  } else {
    return cb(new Error("No domain database specified"));
  }
}

//Requires appId to be specified -- appId === FH_WIDGET
//Full dynofarm app name === FH_APPNAME
//Env === FH_ENV
var getForms = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;

    options.appId = config.fhapi.widget; //AppId should never be set by anything but FH_WIDGET -- override anything that has already set it.
    fhforms.getForms(options, cb);
  });
};

var getForm = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;

    options.appId = config.fhapi.widget; //AppId should never be set by anything but FH_WIDGET -- override anything that has already set it.

    fhforms.getForm(options, cb);
  });
};

//Requires appId
var getTheme = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;
    options.appId = config.fhapi.widget; //AppId should never be set by anything but FH_WIDGET -- override anything that has already set it.
    fhforms.getTheme(options, cb);
  });
};

//Requires appId
var getAppClientConfig = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;
    options.appId = config.fhapi.widget; //AppId should never be set by anything but FH_WIDGET -- override anything that has already set it.
    fhforms.getAppClientConfig(options, cb);
  });
};

var submitFormData = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;

    if(options.submission === undefined){
      options.submission = {};
    }

    options.submission.appId = config.fhapi.widget; //AppId should never be set by anything but FH_WIDGET -- override anything that has already set it.
    options.submission.appClientId = options.appClientId;
    options.submission.appCloudName = config.fhapi.appname;
    options.submission.appEnvironment = process.env.FH_ENV || "NOT-SET";

    fhforms.submitFormData(options, cb);
  });
};

var submitFormFile = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;
    fhforms.submitFormFile(options, cb);
  });
};

var getSubmissionStatus = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;
    fhforms.getSubmissionStatus(options, cb);
  });
};

var completeSubmission = function(options, cb){

  checkDomainDatabase(function(err, domainDbUri){
    if(err) return cb(err);
    options.uri = domainDbUri;
    fhforms.completeFormSubmission(options, cb);
  });
};

var getFullyPopulatedForms = function (options, cb){
   checkDomainDatabase(function (err, uri){
     if(err) return cb(err);
     options.uri = uri;
     fhforms.getPopulatedFormList(options, cb);
   });
};

var getSubmissions = function (options, cb){
  checkDomainDatabase(function (err, uri){
    if(err) return cb(err);
    options.uri = uri;

    fhforms.getSubmissions(options, cb);
  });
};

var getSubmission = function (options, cb){
  checkDomainDatabase(function(err, uri){
    if(err) return cb(err);

    var params = {};
    params._id = options.submissionId;
    options.uri = uri;

    fhforms.getSubmission(options, params, cb);
  });
};

var getSubmissionFile = function(options, cb){
  checkDomainDatabase(function(err, uri){
    if(err) return cb(err);

    var params = {};
    params.uri = uri;
    fhforms.getSubmissionFile(params, options, cb);
  });
};

/**
 * Creating a submission model for use with the $fh.forms Cloud API
 * @param options {formId: <<Id of the form to create a submission for>>}
 * @param cb
 */
var createSubmissionModel = function(options, cb){
  var form = options.form;

  //The submission needs to be initialised with a form.
  if(!form){
    return cb("No form entered.");
  }

  return cb(undefined, new Submission({form: form, formId: form._id}));
}

/*
A convienience object for preparing a submission for upload to the database.
 */
var Submission = function(params){
  params = params || {};
  var self = this;
  self.form = params.form;
  //A flag for keeping files/not keeping files on the file system when they have been submitted.
  //Default is false;
  self.keepFiles = params.keepFiles;

  /**
   * <<filePlaceHolderId>> : <<paused streamable>>
   */
  self.filesToUpload = {

  }

  /**
   * Values for each of the fields
   *
   * {
   *  <<field Id>>: [<<field Values>>]
   * }
   */
  self.fieldValues = {

  };

  //Base Submission Definition
  self.submissionData = {
    formId: params.formId,
    timezoneOffset: 0,
    deviceId: "NOT-SET",
    deviceIPAddress: "127.0.0.1",
    deviceFormTimestamp: self.form.lastUpdated,
    formFields: [],
    appClientId: config.fhapi.widget,
    comments: []
  };
};

/**
 * Add input value into a submission
 * @param params {fieldId: <<Id Of Field To Add To>>, fieldCode: <<Field Code of Field To Add To>>, value: <<value to input data into>>, stream: <<Readable stream to save.>>}
 *
 * @returns error <<If there is an error adding the input, an error is returned>>
 */
Submission.prototype.addFieldInput = function(params){
  var self = this;
  var field;

  //Finding the JSON definition of a field to add data to.
  function findFieldDefinition(){
    var foundField;
    if(!(params.fieldId || params.fieldCode)){
      return undefined;
    }

    //Iterating through each of the pages to find a matching field.
    _.each(self.form.pages, function(page){
      _.each(page.fields, function(field){
        var fieldId = field._id;
        var fieldCode = field.fieldCode;

        if(fieldId === params.fieldId || fieldCode === params.fieldCode){
          foundField = field;
        }
      });
    });

    return foundField;
  }

  /**
   * Adding a value to an index.
   * Most inputs are validated by the rules engine, but file inputs need to be a file location on the local app.
   * It is advisible to download the file to local storage first.
   * @returns {error/undefined}
   */
  function processInputValue(){
    var value = params.value;
    var index = params.index || 0;
    var fieldType = field.type;

    //Checking for a value.
    if(typeof(value) === "undefined" || value === null){
      return "No value entered.";
    }

    /**
     * File-base fields (photo, signature and file) need to stream the file to the mongo server.
     */
    if(fieldType === "photo" || fieldType === "signature" || fieldType === "file"){
      //The stream must be a paused stream.
      var fileURI = value.fileStream;

      delete value.fileStream;

      //It must be possible to stream the object to the database.
      if(!(typeof(fileURI) === "string")){
        return "Expected a string URI object when streaming a file-based field ";
      }

      if(!(value.fileName && value.fileSize && value.fileType)){
        return "Invalid file parameters. Params: " + JSON.stringify(value);
      }

      //Generating a random file hash name.
      var hashName = "filePlaceHolder" + Date.now() + Math.floor(Math.random() * 10000000000000);
      var fileUpdateTime = Date.now;

      self.filesToUpload[hashName] = {
        fieldId: field._id,
        fileStream: fileURI
      };

      value.hashName = hashName;
      value.fileUpdateTime = fileUpdateTime;
    }

    self.fieldValues[field._id] = self.fieldValues[field._id] || [];
    self.fieldValues[field._id][index] = value;
    return undefined;
  }

  if(!self.form){
    return "No form definition assigned to this submission";
  }

  field = findFieldDefinition();

  if(!field){
    return "No field found. Params: " + JSON.stringify(params);
  }

  var inputProcessError = processInputValue();

  if(inputProcessError){
    return inputProcessError;
  }

  return undefined;
};

/**
 * Submitting the form data and any files associated with the submission
 * @returns {*}
 */
Submission.prototype.submit = function(cb){
  var self = this;
  var processedFieldValues = _.map(self.fieldValues, function(valuesArray, fieldId){
    valuesArray = _.filter(valuesArray, function(value){
      return typeof(value) !== undefined && value !== null;
    });

    var valueObject = {
      fieldId: fieldId,
      fieldValues: valuesArray
    };

    return valueObject;
  });

  self.submissionData.formFields = processedFieldValues;

  //Now ready to submit form data.
  submitFormData({submission: self.submissionData, appClientId: self.submissionData.appClientId}, function(err, result){
    if(err || result.error){
      return cb(err || result.error);
    }

    self.submissionId = result.submissionId;

    var hashNames = Object.keys(self.filesToUpload);

    /**
     * Uploading any files that were part of the submission.
     */
    async.eachSeries(hashNames, function(hashName, cb){
      var fileData = self.filesToUpload[hashName];
      submitFormFile({submission: {fileId : hashName, submissionId: self.submissionId, fieldId: fileData.fieldId, fileStream: fileData.fileStream, keepFile: self.keepFiles}}, cb);
    }, function(err){
      //Returning the remote submission Id when finished.
      if(err){
        return cb(err);
      }

      completeSubmission({submission: {submissionId: self.submissionId}}, function(err, completeStatus){
        if(err || completeStatus.status !== "complete"){
          return cb(err || "Complete Submission Failed");
        }

        return cb(undefined, self.submissionId);
      });
    });
  });
};

var forms = {
  "getForms" : getForms,
  "getForm" : getForm,
  "getPopulatedFormList":getFullyPopulatedForms,
  "getTheme" : getTheme,
  "getAppClientConfig": getAppClientConfig,
  "submitFormData" : submitFormData,
  "createSubmissionModel": createSubmissionModel,
  "submitFormFile" : submitFormFile,
  "getSubmissionStatus" : getSubmissionStatus,
  "completeSubmission" : completeSubmission,
  "getSubmissions":getSubmissions,
  "getSubmission": getSubmission,
  "getSubmissionFile":getSubmissionFile,
  "registerListener": fhforms.registerListener,
  "deregisterListener": fhforms.deregisterListener
};

module.exports = function(cfg){
  assert.ok(cfg, 'cfg is undefined');
  config = cfg;
  logger = cfg.logger;
  appname = cfg.fhapi.appname;
  fhutils = new futils(config);
  return forms;
};



