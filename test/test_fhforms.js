var proxyquire = require('proxyquire').noCallThru();
var mockForms = require('./fixtures/forms.js');

module.exports = {
  'test getForms' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getForms({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test getForm' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getForm({appClientId:'1234', "_id": "formId1234"}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test getTheme' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getTheme({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test submitFormData' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.submitFormData({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test submitFormFile' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.submitFormFile({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test getSubmissionStatus' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getSubmissionStatus({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test completeSubmission' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.completeSubmission({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test getAppClientConfig' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getAppClientConfig({appClientId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  "test getFullyPopulatedForms ": function (test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getPopulatedFormList({"formids":[]}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  }
};