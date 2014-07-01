var proxyquire = require('proxyquire').noCallThru();
var mockForms = require('./fixtures/forms.js');
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
  'test submitFormFile' : function(finish){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.submitFormFile({appClientId:'1234'}, function(err, res){
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