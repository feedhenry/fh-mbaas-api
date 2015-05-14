var assert = require('assert'),
  futils = require('./fhutils'),
  mbaasClient = require('fh-mbaas-client'),
  async = require('async'),
  _ = require('underscore'),
  fs = require('fs'),
  logger,
  appname,
  config,
  fhutils;

var util = require('util');
var events = require("events");
var forms;

var getForms = function (params, cb) {
  mbaasClient.app.forms.list({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain
  }, cb);
};

/**
 * Search For Forms Based On Id. Returns Fully Populated Forms
 * @param options
 * @param cb
 */
var searchForms = function(options, cb){
  mbaasClient.app.forms.search({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    searchParams: options
  }, cb);
};

var getForm = function (options, cb) {
  mbaasClient.app.forms.get({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.id
  }, cb);
};

//Requires appId
var getTheme = function (options, cb) {
  mbaasClient.app.themes.get({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain
  }, cb);
};

//Requires appId
var getAppClientConfig = function (options, cb) {
  mbaasClient.app.formsConfig.get({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain
  }, cb);
};

var submitFormData = function (options, cb) {
  var self = this;

  options.submission = options.submission || {};
  options.submission.appCloudName = config.fhapi.appname;

  mbaasClient.app.forms.submitFormData({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.submission.formId,
    submission: options.submission
  }, function(err, submissionResult){
    if(err){
      forms.emit('submissionError', err);
      return cb(err);
    }

    forms.emit('submissionStarted', submissionResult);
    return cb(undefined, submissionResult);
  });
};

var submitFormFile = function (options, cb) {
  mbaasClient.app.submissions.uploadFile({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.id,
    fieldId: options.fieldId,
    fileId: options.fileId,
    fileDetails: options.fileDetails
  }, cb);
};

var submitFormFileBase64 = function(options, cb){
  mbaasClient.app.submissions.uploadFileBase64({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.id,
    fieldId: options.fieldId,
    fileId: options.fileId,
    fileDetails: options.fileDetails
  }, cb);
};

var getSubmissionStatus = function (options, cb) {
  mbaasClient.app.submissions.status({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.id
  }, cb);
};

var completeSubmission = function (options, cb) {
  var self = this;
  mbaasClient.app.submissions.complete({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.id
  }, function(err, completionResult){
    if(err){
      return cb(err);
    }

    forms.emit('submissionComplete', completionResult);
    return cb(undefined, completionResult);
  });
};

var getSubmissions = function (options, cb) {
  mbaasClient.app.submissions.list({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain
  }, cb);
};

/**
 * Function to search submissions related to this environment
 * @param options
 * @param cb
 */
var searchSubmissions = function(options, cb){
  mbaasClient.app.submissions.search({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    searchParams: options
  }, cb);
};

var getSubmission = function (options, cb) {
  mbaasClient.app.submissions.get({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.id
  }, cb);
};

var getSubmissionFile = function (options, cb) {
  mbaasClient.app.submissions.getFile({
    environment: config.fhmbaas.environment,
    domain: config.fhmbaas.domain,
    id: options.id,
    fileId: options.fileId
  }, cb);
};

/**
 * Creating a submission model for use with the $fh.forms Cloud API
 * @param options {formId: <<Id of the form to create a submission for>>}
 * @param cb
 */
var createSubmissionModel = function (options, cb) {
  var form = options.form;

  //The submission needs to be initialised with a form.
  if (!form) {
    return cb("No form entered.");
  }

  return cb(undefined, new Submission({form: form, formId: form._id}));
};

/*
 A convienience object for preparing a submission for upload to the database.
 */
var Submission = function (params) {
  params = params || {};
  var self = this;
  self.form = params.form;
  //A flag for keeping files/not keeping files on the file system when they have been submitted.
  //Default is false;
  self.keepFiles = params.keepFiles;

  /**
   * <<filePlaceHolderId>> : <<paused streamable>>
   */
  self.filesToUpload = {};

  /**
   * Values for each of the fields
   *
   * {
   *  <<field Id>>: [<<field Values>>]
   * }
   */
  self.fieldValues = {};

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
Submission.prototype.addFieldInput = function (params) {
  var self = this;
  var field;

  //Finding the JSON definition of a field to add data to.
  function findFieldDefinition() {
    var foundField;
    if (!(params.fieldId || params.fieldCode)) {
      return undefined;
    }

    //Iterating through each of the pages to find a matching field.
    _.each(self.form.pages, function (page) {
      _.each(page.fields, function (field) {
        var fieldId = field._id;
        var fieldCode = field.fieldCode;

        if (fieldId === params.fieldId || fieldCode === params.fieldCode) {
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
  function processInputValue() {
    var value = params.value;
    var index = params.index || 0;
    var fieldType = field.type;

    //Checking for a value.
    if (typeof(value) === "undefined" || value === null) {
      return "No value entered.";
    }

    /**
     * File-base fields (photo, signature and file) need to stream the file to the mongo server.
     */
    if (fieldType === "photo" || fieldType === "signature" || fieldType === "file") {
      //The stream must be a paused stream.
      var fileURI = value.fileStream;

      delete value.fileStream;

      //It must be possible to stream the object to the database.
      if (!(typeof(fileURI) === "string")) {
        return "Expected a string URI object when streaming a file-based field ";
      }

      if (!(value.fileName && value.fileSize && value.fileType)) {
        return "Invalid file parameters. Params: " + JSON.stringify(value);
      }

      //Generating a random file hash name.
      var hashName = "filePlaceHolder" + Date.now() + Math.floor(Math.random() * 10000000000000);
      var fileUpdateTime = Date.now;

      self.filesToUpload[hashName] = {
        fieldId: field._id,
        stream: fileURI,
        name: value.fileName,
        size: value.fileSize,
        type: value.fileType
      };

      value.hashName = hashName;
      value.fileUpdateTime = fileUpdateTime;
    }

    self.fieldValues[field._id] = self.fieldValues[field._id] || [];
    self.fieldValues[field._id][index] = value;
    return undefined;
  }

  if (!self.form) {
    return "No form definition assigned to this submission";
  }

  field = findFieldDefinition();

  if (!field) {
    return "No field found. Params: " + JSON.stringify(params);
  }

  var inputProcessError = processInputValue();

  if (inputProcessError) {
    return inputProcessError;
  }

  return undefined;
};

/**
 * Submitting the form data and any files associated with the submission
 * @returns {*}
 */
Submission.prototype.submit = function (cb) {
  var self = this;
  var processedFieldValues = _.map(self.fieldValues, function (valuesArray, fieldId) {
    valuesArray = _.filter(valuesArray, function (value) {
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
  submitFormData({
    submission: self.submissionData
  }, function (err, result) {
    if (err || result.error) {
      return cb(err || result.error);
    }

    self.submissionId = result.submissionId;

    var hashNames = Object.keys(self.filesToUpload);

    /**
     * Uploading any files that were part of the submission.
     */
    async.eachSeries(hashNames, function (hashName, cb) {
      var fileData = self.filesToUpload[hashName];

      //Creating A Read Stream If The File Is A Path
      if(_.isString(fileData.stream)){
        fileData.stream = fs.createReadStream(fileData.stream);
      }

      submitFormFile({
        fileId: hashName,
        id: self.submissionId,
        fieldId: fileData.fieldId,
        fileDetails: fileData
      }, cb);
    }, function (err) {
      //Returning the remote submission Id when finished.
      if (err) {
        return cb(err);
      }

      completeSubmission({id: self.submissionId}, function (err, completeStatus) {
        if (err || completeStatus.status !== "complete") {
          return cb(err || "Complete Submission Failed");
        }

        return cb(undefined, self.submissionId);
      });
    });
  });
};

//Forms Is An Event Emitter For Submission Events
function Forms(){
  events.EventEmitter.call(this);

  this.getForms = getForms;
  this.searchForms = searchForms;
  this.getForm = getForm;
  this.getTheme = getTheme;
  this.getAppClientConfig = getAppClientConfig;
  this.submitFormData = submitFormData;
  this.createSubmissionModel = createSubmissionModel;
  this.submitFormFile = submitFormFile;
  this.submitFormFileBase64 = submitFormFileBase64;
  this.getSubmissionStatus = getSubmissionStatus;
  this.completeSubmission = completeSubmission;
  this.getSubmissions = getSubmissions;
  this.getSubmission = getSubmission;
  this.getSubmissionFile = getSubmissionFile;
  this.searchSubmissions = searchSubmissions;

  return this;
}

util.inherits(Forms, events.EventEmitter);

forms = new Forms();

module.exports = function (cfg) {
  assert.ok(cfg, 'cfg is undefined');
  config = cfg;
  logger = cfg.logger;
  appname = cfg.fhapi.appname;
  fhutils = new futils(config);
  return forms;
};



