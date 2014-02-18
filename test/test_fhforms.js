var proxyquire = require('proxyquire').noCallThru();
var mockForms = require('./fixtures/forms.js');

module.exports = {
  'test getForms' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getForms({appId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test getForm' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getForm({appId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test getTheme' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getTheme({appId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test submitFormData' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.submitFormData({appId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test submitFormFile' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.submitFormFile({appId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test getSubmissionStatus' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.getSubmissionStatus({appId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  },
  'test completeSubmission' : function(test, assert){
    var $fh = proxyquire('../lib/api.js', {'fh-forms' : mockForms});
    $fh.forms.completeSubmission({appId:'1234'}, function(err, res){
      assert.ok(!err);
      assert.ok(res);
      test.finish();
    });
  }
}