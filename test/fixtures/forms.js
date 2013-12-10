var assert = require('assert');
module.exports = {
  "getForms" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri)
    assert.ok(options.appId);
    return cb(undefined, {"forms": {}})
  },
  "getForm" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri);
    assert.ok(options.appId);
    cb(undefined, {"_id" : "someformId"});
  },
  "getTheme" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri);
    assert.ok(options.appId);
    cb(undefined, {"_id" : "someThemeId"});
  },
  "submitFormData" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri);
    assert.ok(options.submission);
    assert.ok(options.submission.appId);
    assert.ok(options.submission.appCloudName);
    assert.ok(options.submission.appEnvironment);
    cb(undefined, {"submssionId" : "submissionId123456"});
  },
  "submitFormFile" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri);
    cb(undefined, {"status" : "ok"});
  },
  "completeFormSubmission" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri);
    cb(undefined, {"status" : "complete"});
  },
  "getSubmissionStatus" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri);
    cb(undefined, {"status" : "pending"});
  }
}