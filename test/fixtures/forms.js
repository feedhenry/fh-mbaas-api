var assert = require('assert');
module.exports = {
  "getForms": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    return cb(undefined, {"forms": {}})
  },
  "getForm": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    assert.ok(options._id, "Expected form id but got nothing");
    cb(undefined, {"_id": "someformId", pages:
      [
        {
          fields:
          [
            {
              _id: "fieldText",
              fieldCode: "fieldTextCode",
              type: "text"
            },
            {
              _id: "fieldPhoto",
              fieldCode: "fieldPhotoCode",
              type: "photo"
            }
          ]
        }
      ]
    });
  },
  "getTheme": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    cb(undefined, {"_id": "someThemeId"});
  },
  "submitFormData": function (options, cb) {
    assert.ok(options);
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.submission, "Expected a submission object but got nothing");
    assert.ok(options.submission.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.submission.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    assert.ok(options.submission.appClientId, "Expected options.submission.appClientId but got nothing");
    assert.ok(options.submission.appCloudName, "Expected options.submission.appCloudName but got nothing");
    assert.ok(options.submission.appEnvironment, "Expected options.submission.appEnvironment but got nothing");
    cb(undefined, {"submssionId": "submissionId123456"});
  },
  "submitFormFile": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.submission, "Expected a submission object but got nothing");
    assert.ok(options.submission.fileStream, "Expected a file stream but got nothing");
    cb(undefined, {"status": "ok"});
  },
  "completeFormSubmission": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    cb(undefined, {"status": "complete"});
  },
  "getSubmissionStatus": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    cb(undefined, {"status": "pending"});
  },
  "getAppClientConfig": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.appId, "Expected appId but got nothing");
    assert.ok(options.appId === "c0TPJzF6ztq0W12345PEC5W8", "Expected appId to be the FH_WIDGET value: c0TPJzF6ztq0W12345PEC5W8 but was " + options.appId);//ENSURING THE APPID IS NOW THE FH_WIDGET ID
    cb(undefined, {config: {}});
  },
  "getPopulatedFormList": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.formids, "Expected appId but got nothing");
    cb(undefined, {"forms": []});
  },
  "getSubmissions": function (options, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(options.subids, "Expected subids but got nothing");
    cb(undefined, {});
  },
  "getSubmission": function (options, params, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(params._id, "Expected params._id but got nothing");
    cb(undefined, {});
  },
  "getSubmissionFile": function (options, params, cb) {
    assert.ok(options, "Expected options but got nothing");
    assert.ok(options.uri, "Expected options.uri but got nothing");
    assert.ok(params._id, "Expected filegroupId but got nothing");
    cb(undefined, {
      stream: "fileStream",
      type: "contentType",
      length: 122
    });
  }

};