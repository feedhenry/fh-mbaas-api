var assert = require('assert');
module.exports = {
  "getForms" : function(options, cb){
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    return cb(undefined, {"forms": {}})
  },
  "getForm" : function(options, cb){
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    assert.ok(options._id, "Expected form id but got nothing");
    cb(undefined, {"_id" : "someformId"});
  },
  "getTheme" : function(options, cb){
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    cb(undefined, {"_id" : "someThemeId"});
  },
  "submitFormData" : function(options, cb){
    assert.ok(options);
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.submission, "Expected a submission object but got nothing");
    assert.ok(options.submission.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.submission.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    assert.ok(options.submission.appClientId, "Expected app client id to be: 1234 but was " + options.submission.appClientId);
    assert.ok(options.submission.appCloudName, "Expected submission.appCloudName to be " + process.env.FH_APPNAME + " but was " + options.submission.appCloudName);
    assert.ok(options.submission.appEnvironment, "Expected submission.appEnvironment to be " + process.env.FH_ENV + " but was " + options.submission.appEnvironment);
    cb(undefined, {"submssionId" : "submissionId123456"});
  },
  "submitFormFile" : function(options, cb){
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    cb(undefined, {"status" : "ok"});
  },
  "completeFormSubmission" : function(options, cb){
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    cb(undefined, {"status" : "complete"});
  },
  "getSubmissionStatus" : function(options, cb){
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    cb(undefined, {"status" : "pending"});
  },
  "getAppClientConfig" : function(options, cb){
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId, "Expected appId but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    cb(undefined, {config: {}});
  }
}