var proxyquire = require('proxyquire').noCallThru();
var mockForms = require('./fixtures/forms.js');
var fs = require('fs');
var assert = require('assert');

module.exports = {
  'test getForms' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getForms({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test getForm' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getForm({appClientId:'1234', "_id": "formId1234"}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test getTheme' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getTheme({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test submitFormData' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.submitFormData({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  //Testing that a submission model requires a form.
  'test Submission Model' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.createSubmissionModel({}, function(err, submission){
      assert.ok(err, "Expected err but got nothing");
      assert.ok(err.toLowerCase().indexOf("no form") > -1, "Expected a no form error");
      finish();
    });
  },
  'test Create Submission Model' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});

    $fh.forms.getForm({appClientId:'1234', "_id": "someformId"}, function(err, form){
      assert.ok(!err, "Unexpected error " + err);
      $fh.forms.createSubmissionModel({form: form}, function(err, submission){
        assert.ok(!err, "Unexpected error " + err);

        assert.ok(submission, "Expected a submission but got nothing.");
        assert.ok(submission.submissionData, "Expected submission Data but got nothing");
        assert.ok(submission.submissionData.formId === "someformId", "Expected submission formId to be someformId but got: " + submission.submissionData.formId);
        finish();
      });
    });
  },
  'test Add Input Value' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});

    $fh.forms.getForm({appClientId:'1234', "_id": "formId1234"}, function(err, form){
      assert.ok(!err, "Unexpected error " + err);
      $fh.forms.createSubmissionModel({form: form}, function(err, submission){
        assert.ok(!err, "Unexpected error " + err);

        //Testing fieldId field selector
        var err = submission.addFieldInput({fieldId: "fieldText", value: "sometext"});

        assert.ok(!err, "Unexpected error " + err);
        assert.ok(submission.fieldValues["fieldText"].length === 1, "Expected length to be 1 but was " + submission.fieldValues["fieldText"].length);
        assert.ok(submission.fieldValues["fieldText"][0] === "sometext", "Expected input to be sometext but was " + submission.fieldValues["fieldText"][0]);

        err = submission.addFieldInput({fieldCode: "fieldTextCode", value: "sometext2", index: 1});
        assert.ok(!err, "Unexpected error " + err);

        assert.ok(submission.fieldValues["fieldText"].length === 2, "Expected length to be 1 but was " + submission.fieldValues["fieldText"].length);
        assert.ok(submission.fieldValues["fieldText"][0] === "sometext", "Expected input to be sometext but was " + submission.fieldValues["fieldText"][0]);
        assert.ok(submission.fieldValues["fieldText"][1] === "sometext2", "Expected input to be sometext2 but was " + submission.fieldValues["fieldText"][1]);

        finish();
      });
    });
  },
  'test Add File Input Value' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});

    $fh.forms.getForm({appClientId:'1234', "_id": "formId1234"}, function(err, form){
      assert.ok(!err, "Unexpected error " + err);
      $fh.forms.createSubmissionModel({form: form}, function(err, submission){
        assert.ok(!err, "Unexpected error " + err);

        //Testing fieldId field selector
        var err = submission.addFieldInput({fieldId: "fieldPhoto", value: {fileName: "someFileName", fileSize: 123, fileType: "image/jpeg"}, localURI: __dirname + '/fixtures/testimg1.jpg'});
        assert.ok(!err, "Unexpected error " + err);

        assert.ok(submission.fieldValues["fieldPhoto"].length === 1, "Expected file input length to be 1 but was " + submission.fieldValues["fieldPhoto"].length);
        //Checking file 1
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileName === "someFileName", "Expected fileName to be someFileName but was " + submission.fieldValues["fieldPhoto"][0].fileName);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileSize === 123, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][0].fileSize);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileType === "image/jpeg", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][0].fileType);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileUpdateTime, "Expected fileUpdateTime but was undefined");
        assert.ok(submission.fieldValues["fieldPhoto"][0].hashName, "Expected hashName but was undefined");

        err = submission.addFieldInput({fieldCode: "fieldPhotoCode", value: {fileName: "someFileName2", fileSize: 312, fileType: "image/png"}, index: 1, localURI: __dirname + '/fixtures/testimg2.png'});
        assert.ok(!err, "Unexpected error " + err);

        assert.ok(submission.fieldValues["fieldPhoto"].length === 2, "Expected file input length to be 2 but was " + submission.fieldValues["fieldPhoto"].length);

        //Checking file 1
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileName === "someFileName", "Expected fileName to be someFileName but was " + submission.fieldValues["fieldPhoto"][0].fileName);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileSize === 123, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][0].fileSize);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileType === "image/jpeg", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][0].fileType);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileUpdateTime, "Expected fileUpdateTime but was undefined");
        assert.ok(submission.fieldValues["fieldPhoto"][0].hashName, "Expected hashName but was undefined");

        //Checking file 2
        assert.ok(submission.fieldValues["fieldPhoto"][1].fileName === "someFileName2", "Expected fileName to be someFileName but was " + submission.fieldValues["fieldPhoto"][1].fileName);
        assert.ok(submission.fieldValues["fieldPhoto"][1].fileSize === 312, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][1].fileSize);
        assert.ok(submission.fieldValues["fieldPhoto"][1].fileType === "image/png", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][1].fileType);
        assert.ok(submission.fieldValues["fieldPhoto"][1].fileUpdateTime, "Expected fileUpdateTime but was undefined");
        assert.ok(submission.fieldValues["fieldPhoto"][1].hashName, "Expected hashName but was undefined");

        assert.ok(submission.fieldValues["fieldPhoto"][0].hashName !== submission.fieldValues["fieldPhoto"][1].hashName, "hashNames for 2 files are the same.");

        finish();
      });
    });
  },
  'test Submit Submission With File' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});

    $fh.forms.getForm({appClientId:'1234', "_id": "formId1234"}, function(err, form){
      assert.ok(!err, "Unexpected error " + err);
      $fh.forms.createSubmissionModel({form: form, keepFiles: true}, function(err, submission){
        assert.ok(!err, "Unexpected error " + err);

        //Testing fieldId field selector

        var err = submission.addFieldInput({fieldId: "fieldPhoto", value: {fileName: "someFileName", fileSize: 123, fileType: "image/jpeg"}, localURI: __dirname + '/fixtures/testimg1.jpg'});
        assert.ok(!err, "Unexpected error " + err);

        assert.ok(submission.fieldValues["fieldPhoto"].length === 1, "Expected file input length to be 1 but was " + submission.fieldValues["fieldPhoto"].length);
        //Checking file 1
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileName === "someFileName", "Expected fileName to be someFileName but was " + submission.fieldValues["fieldPhoto"][0].fileName);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileSize === 123, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][0].fileSize);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileType === "image/jpeg", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][0].fileType);
        assert.ok(submission.fieldValues["fieldPhoto"][0].fileUpdateTime, "Expected fileUpdateTime but was undefined");
        assert.ok(submission.fieldValues["fieldPhoto"][0].hashName, "Expected hashName but was undefined");

        err = submission.addFieldInput({fieldId: "fieldText", value: "sometext"});
        assert.ok(!err, "Unexpected error " + err);

        submission.submit(function(err, submissionId){
          assert.ok(!err, "Unexpected error " + err);
          assert.ok(submissionId === "submissionId123456", "Expected submission Id to be submissionId123456 but was " + submissionId);
          finish();
        });
      });
    });
  },
  'test submitFormFile' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.submitFormFile({appClientId:'1234', submission: {fileStream: "Some Readable File Stream", fileId: "SomeFileID", submissionId: "ASubmissionId", fieldId: "fileFieldId"}}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test getSubmissionStatus' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getSubmissionStatus({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test completeSubmission' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.completeSubmission({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test getAppClientConfig' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getAppClientConfig({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  "test getFullyPopulatedForms ": function (finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getPopulatedFormList({"formids":[]}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  "test getSubmissions ": function (finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getSubmissions({"subids":[]}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  "test getSubmission ": function (finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getSubmission({"submissionId": "submission1234"}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  "test getSubmissions with files": function (finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getSubmissions({"subids":["submissionId1", "submissionId2"]}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  "test getSubmissionFile ": function (finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getSubmissionFile({"_id": "testSubFileGroupId"}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  }
};