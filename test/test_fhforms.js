require('./fixtures/env.js');
var cfg = require('./fixtures/mockConfig.js')();
var proxyquire = require('proxyquire').noCallThru();
var assert = require('assert');
var stream = require('stream');
var mockReadStream = require('./fixtures/mockReadStream');
var _ = require('underscore');


module.exports = {
  'test getForms': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        forms: {
          list: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);

            return cb(undefined, [
              {
                _id: "someformid",
                name: "someformname"
              }
            ]);
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.getForms({}, function (err, res) {
      assert.ok(!err);
      assert.ok(_.isArray(res));
      finish();
    });
  },
  'test Search Forms': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        forms: {
          search: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(_.isEqual(params.searchParams.id, ["someformid1", "someformid2"]), true);

            return cb(undefined, [
              {
                _id: "someformid1",
                name: "someformname2"
              },
              {
                _id: "someformid2",
                name: "someformname2"
              }
            ]);
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.searchForms({id: ["someformid1", "someformid2"]}, function (err, res) {
      assert.ok(!err);
      assert.ok(_.isArray(res));
      finish();
    });
  },
  'test getForm': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        forms: {
          get: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "formId1234");

            return cb(undefined, {
              _id: "formId1234",
              name: "someformname"
            });
          }
        }
      }
    };
    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.getForm({"id": "formId1234"}, function (err, res) {
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test getTheme': function (finish) {
    var $fh = {};
    var mockMbaasClient = {
      app: {
        themes: {
          get: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);

            return cb(undefined, {
              _id: "themeid1234",
              name: "Some Theme Name"
            });
          }
        }
      }
    };
    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.getTheme({}, function (err, res) {
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test submitFormData': function (finish) {
    var $fh = {};
    var submission = {formId: "formid1234", formFields: [{fieldId: "field1234", fieldValues: ["some field val"]}]};

    var mockMbaasClient = {
      app: {
        forms: {
          submitFormData: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "formid1234");
            assert.equal(params.submission, submission);

            return cb(undefined, {
              submissionId: "someremotesubmissionid"
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);

    $fh.forms.submitFormData({submission: submission}, function (err, res) {
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },

  'test submitFormData with events': function (finish) {
    var $fh = {};
    var submission = {formId: "formid1234", formFields: [{fieldId: "field1234", fieldValues: ["some field val"]}]};

    var mockMbaasClient = {
      app: {
        forms: {
          submitFormData: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "formid1234");
            assert.equal(params.submission, submission);

            return cb(undefined, {
              submissionId: "someremotesubmissionid",
              submission: submission,
              submissionStartedTimestamp: 1234
            });
          }
        },
        submissions: {
          complete: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "submission1234");

            return cb(undefined, {
              submissionId: "submission1234",
              submission: submission,
              submissionCompletedTimestamp: 312
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    var submissionStartedEventCalled = false;
    var submissionCompleteEventCalled = false;

    //Listening to submissionStarted events
    $fh.forms.on('submissionStarted', function (submissionParams) {
      assert.ok(!submissionStartedEventCalled, "Submission started event called twice");
      assert.ok(submissionParams, "Expected submission params to be passed to the submissionStarted evnet.");
      submissionStartedEventCalled = true;
    });

    //Listening to submissionComplete events
    $fh.forms.on('submissionComplete', function (submissionParams) {
      assert.ok(!submissionCompleteEventCalled, "Submission Complete event called twice");
      assert.ok(submissionParams, "Expected submission params to be passed to the submissionStarted evnet.");
      submissionCompleteEventCalled = true;
    });

    $fh.forms.submitFormData({submission: submission}, function (err, res) {
      assert.ok(!err);
      assert.ok(res);

      assert.ok(submissionStartedEventCalled, "Expected the submission started event to have been called.");

      $fh.forms.completeSubmission({
        id: "submission1234"
      }, function (err, res) {
        assert.ok(!err);
        assert.ok(res);

        assert.ok(submissionCompleteEventCalled, "Expected the submission complete event to have been called");

        finish();
      });
    });
  },
  //Testing that a submission model requires a form.
  'test Submission Model': function (finish) {
    var $fh = {};
    $fh.forms = require('../lib/forms.js')(cfg);
    $fh.forms.createSubmissionModel({}, function (err, submission) {
      assert.ok(err, "Expected err but got nothing");
      assert.ok(err.toLowerCase().indexOf("no form") > -1, "Expected a no form error");
      finish();
    });
  },
  'test Create Submission Model': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        forms: {
          get: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "formId1234");

            return cb(undefined, {
              _id: "formId1234",
              name: "someformname"
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);

    $fh.forms.getForm({id: "formId1234"}, function (err, form) {
      assert.ok(!err, "Unexpected error " + err);
      $fh.forms.createSubmissionModel({form: form}, function (err, submission) {
        assert.ok(!err, "Unexpected error " + err);

        assert.ok(submission, "Expected a submission but got nothing.");
        assert.ok(submission.submissionData, "Expected submission Data but got nothing");
        assert.ok(submission.submissionData.formId === "formId1234", "Expected submission formId to be someformId but got: " + submission.submissionData.formId);
        finish();
      });
    });
  },
  'test Add Input Value': function (finish) {
    var $fh = {};

    var mockForm = {
      _id: "formId1234",
      name: "someformname",
      pages: [{
        _id: "somepageid",
        fields: [{
          _id: "fieldText",
          type: "text",
          fieldCode: "fieldTextCode"
        }]
      }]
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': {}})(cfg);

    $fh.forms.createSubmissionModel({form: mockForm}, function (err, submission) {
      assert.ok(!err, "Unexpected error " + err);

      //Testing fieldId field selector
      var fieldInputError = submission.addFieldInput({fieldId: "fieldText", value: "sometext"});

      assert.ok(!fieldInputError, "Unexpected error " + fieldInputError);
      assert.ok(submission.fieldValues["fieldText"].length === 1, "Expected length to be 1 but was " + submission.fieldValues["fieldText"].length);
      assert.ok(submission.fieldValues["fieldText"][0] === "sometext", "Expected input to be sometext but was " + submission.fieldValues["fieldText"][0]);

      fieldInputError = submission.addFieldInput({fieldCode: "fieldTextCode", value: "sometext2", index: 1});
      assert.ok(!fieldInputError, "Unexpected error " + fieldInputError);

      assert.ok(submission.fieldValues["fieldText"].length === 2, "Expected length to be 1 but was " + submission.fieldValues["fieldText"].length);
      assert.ok(submission.fieldValues["fieldText"][0] === "sometext", "Expected input to be sometext but was " + submission.fieldValues["fieldText"][0]);
      assert.ok(submission.fieldValues["fieldText"][1] === "sometext2", "Expected input to be sometext2 but was " + submission.fieldValues["fieldText"][1]);

      finish();
    });
  },
  'test Add File Input Value': function (finish) {
    var $fh = {};

    var mockForm = {
      _id: "formId1234",
      name: "someformname",
      pages: [{
        _id: "somepageid",
        fields: [{
          _id: "fieldPhoto",
          type: "photo",
          fieldCode: "fieldPhotoCode"
        }]
      }]
    };

    $fh.forms = require('../lib/forms.js')(cfg);

    $fh.forms.createSubmissionModel({form: mockForm}, function (err, submission) {
      assert.ok(!err, "Unexpected error " + err);

      //Testing fieldId field selector
      var err = submission.addFieldInput({
        fieldId: "fieldPhoto",
        value: {
          fileName: "someFileName",
          fileSize: 123,
          fileType: "image/jpeg",
          fileStream: __dirname + '/fixtures/testimg1.jpg'
        }
      });
      assert.ok(!err, "Unexpected error " + err);

      assert.ok(submission.fieldValues["fieldPhoto"].length === 1, "Expected file input length to be 1 but was " + submission.fieldValues["fieldPhoto"].length);
      //Checking file 1
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileName === "someFileName", "Expected fileName to be someFileName but was " + submission.fieldValues["fieldPhoto"][0].fileName);
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileSize === 123, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][0].fileSize);
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileType === "image/jpeg", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][0].fileType);
      assert.ok(!submission.fieldValues["fieldPhoto"][0].fileStream, "Unexpected fileStream parameter in submission data.");
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileUpdateTime, "Expected fileUpdateTime but was undefined");
      assert.ok(submission.fieldValues["fieldPhoto"][0].hashName, "Expected hashName but was undefined");

      err = submission.addFieldInput({
        fieldCode: "fieldPhotoCode",
        value: {
          fileName: "someFileName2",
          fileSize: 312,
          fileType: "image/png",
          fileStream: __dirname + '/fixtures/testimg2.png'
        },
        index: 1
      });
      assert.ok(!err, "Unexpected error " + err);

      assert.ok(submission.fieldValues["fieldPhoto"].length === 2, "Expected file input length to be 2 but was " + submission.fieldValues["fieldPhoto"].length);

      //Checking file 1
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileName === "someFileName", "Expected fileName to be someFileName but was " + submission.fieldValues["fieldPhoto"][0].fileName);
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileSize === 123, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][0].fileSize);
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileType === "image/jpeg", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][0].fileType);
      assert.ok(!submission.fieldValues["fieldPhoto"][0].fileStream, "Unexpected fileStream parameter in submission data.");
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileUpdateTime, "Expected fileUpdateTime but was undefined");
      assert.ok(submission.fieldValues["fieldPhoto"][0].hashName, "Expected hashName but was undefined");

      //Checking file 2
      assert.ok(submission.fieldValues["fieldPhoto"][1].fileName === "someFileName2", "Expected fileName to be someFileName but was " + submission.fieldValues["fieldPhoto"][1].fileName);
      assert.ok(submission.fieldValues["fieldPhoto"][1].fileSize === 312, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][1].fileSize);
      assert.ok(submission.fieldValues["fieldPhoto"][1].fileType === "image/png", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][1].fileType);
      assert.ok(!submission.fieldValues["fieldPhoto"][1].fileStream, "Unexpected fileStream parameter in submission data.");
      assert.ok(submission.fieldValues["fieldPhoto"][1].fileUpdateTime, "Expected fileUpdateTime but was undefined");
      assert.ok(submission.fieldValues["fieldPhoto"][1].hashName, "Expected hashName but was undefined");

      assert.ok(submission.fieldValues["fieldPhoto"][0].hashName !== submission.fieldValues["fieldPhoto"][1].hashName, "hashNames for 2 files are the same.");

      finish();
    });
  },
  'test Submit Submission With File': function (finish) {
    var $fh = {};

    var mockForm = {
      _id: "formId1234",
      name: "someformname",
      pages: [{
        _id: "somepageid",
        fields: [{
          _id: "fieldPhoto",
          type: "photo",
          fieldCode: "fieldPhotoCode"
        },
          {
            _id: "fieldText",
            type: "text",
            fieldCode: "fieldTextCode"
          }]
      }]
    };

    var mockMbaasClient = {
      app: {
        forms: {
          submitFormData: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "formId1234");
            assert.ok(params.submission, "Expected A Submission Object");

            return cb(undefined, {
              submissionId: "submissionId123456",
              submission: params.submission
            });
          }
        },
        submissions: {
          uploadFile: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "submissionId123456");
            assert.equal(params.fileDetails.name, "someFileName.jpeg");
            assert.equal(params.fileDetails.type, "image/jpeg");
            assert.equal(params.fileDetails.size, 123);
            assert.ok(params.fileDetails.stream instanceof stream.Readable, "Expected The stream param To Be A Readable Stream");

            return cb();
          },
          complete: function(params, cb){
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "submissionId123456");

            return cb(undefined, {
              submissionId: "submissionId123456",
              status: "complete"
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);

    $fh.forms.createSubmissionModel({form: mockForm, keepFiles: true}, function (err, submission) {
      assert.ok(!err, "Unexpected error " + err);

      //Testing fieldId field selector

      var valueInputError = submission.addFieldInput({
        fieldId: "fieldPhoto",
        value: {
          fileName: "someFileName.jpeg",
          fileSize: 123,
          fileType: "image/jpeg",
          fileStream: __dirname + '/fixtures/testimg1.jpg'
        }
      });
      assert.ok(!valueInputError, "Unexpected error " + valueInputError);

      assert.ok(submission.fieldValues["fieldPhoto"].length === 1, "Expected file input length to be 1 but was " + submission.fieldValues["fieldPhoto"].length);
      //Checking file 1
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileName === "someFileName.jpeg", "Expected fileName to be someFileName.jpeg but was " + submission.fieldValues["fieldPhoto"][0].fileName);
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileSize === 123, "Expected fileSize to be 123 but was " + submission.fieldValues["fieldPhoto"][0].fileSize);
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileType === "image/jpeg", "Expected fileSize to be image/jpeg but was " + submission.fieldValues["fieldPhoto"][0].fileType);
      assert.ok(!submission.fieldValues["fieldPhoto"][0].fileStream, "Unexpected fileStream parameter in submission data.");
      assert.ok(submission.fieldValues["fieldPhoto"][0].fileUpdateTime, "Expected fileUpdateTime but was undefined");
      assert.ok(submission.fieldValues["fieldPhoto"][0].hashName, "Expected hashName but was undefined");

      valueInputError = submission.addFieldInput({fieldId: "fieldText", value: "sometext"});
      assert.ok(!valueInputError, "Unexpected error " + valueInputError);

      submission.submit(function (err, submissionId) {
        assert.ok(!err, "Unexpected error " + err);
        assert.ok(submissionId === "submissionId123456", "Expected submission Id to be submissionId123456 but was " + submissionId);
        finish();
      });
    });
  },
  'test submitFormFile': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        submissions: {
          uploadFile: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "submissionId123456");
            assert.equal(params.fieldId, "somefieldid");
            assert.equal(params.fileId, "filePlaceholder1234");
            assert.equal(params.fileDetails.name, "somefile.pdf");
            assert.equal(params.fileDetails.type, "application/pdf");
            assert.equal(params.fileDetails.size, 1234);
            assert.ok(params.fileDetails.stream instanceof stream.Readable, "Expected The stream param To Be A Readable Stream");

            return cb();
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);

    $fh.forms.submitFormFile({
      id: "submissionId123456",
      fieldId: "somefieldid",
      fileId: "filePlaceholder1234",
      fileDetails: {
        name: "somefile.pdf",
        type: "application/pdf",
        size: 1234,
        stream: new mockReadStream()
      }
    }, function (err, res) {
      assert.ok(!err);
      finish();
    });
  },
  'test getSubmissionStatus': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        submissions: {
          status: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "somesubmissionid");

            return cb(undefined, {
              status: "pending"
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);

    $fh.forms.getSubmissionStatus({id: 'somesubmissionid'}, function (err, res) {
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test completeSubmission': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        submissions: {
          complete: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "submission1234");

            return cb(undefined, {
              submissionId: "submission1234",
              submission: {
                _id: "submission1234",
                formFields: []
              },
              submissionCompletedTimestamp: 312
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.completeSubmission({
      id: "submission1234"
    }, function (err, res) {
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  'test getAppClientConfig': function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        formsConfig: {
          get: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);

            return cb(undefined, {
              photoHeight: 123
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.getAppClientConfig({}, function (err, res) {
      assert.ok(!err);
      assert.equal(res.photoHeight, 123);
      finish();
    });
  },
  "test getSubmissions ": function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        submissions: {
          list: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);

            return cb(undefined, [{
              _id: "somesubmissionid",
              formFields: [{
                fieldId: "somefieldid",
                fieldValues: ["somefieldval"]
              }]
            }]);
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.getSubmissions({}, function (err, res) {
      assert.ok(!err);
      assert.ok(_.isArray(res), "Expected An Array Of Submissions");
      finish();
    });
  },
  "test getSubmission ": function (finish) {
    var $fh = {};
    var mockMbaasClient = {
      app: {
        submissions: {
          get: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.id, "submission1234");

            return cb(undefined, {
              _id: "submission1234",
              formFields: [{
                fieldId: "somefieldid",
                fieldValues: ["somefieldval"]
              }]
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.getSubmission({"id": "submission1234"}, function (err, res) {
      assert.ok(!err);
      assert.equal(res._id, "submission1234");
      finish();
    });
  },
  "test Search Submissions": function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        submissions: {
          search: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.searchParams.formId, "someformid");
            assert.equal(_.isEqual(params.searchParams.id, ["submissionId1", "submissionId2"]), true);

            return cb(undefined, {
              _id: "submission1234",
              formId: "someformid",
              formFields: [{
                fieldId: "somefieldid",
                fieldValues: ["somefieldval"]
              }]
            });
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.searchSubmissions({
      "id": ["submissionId1", "submissionId2"],
      "formId": "someformid"
    }, function (err, res) {
      assert.ok(!err);
      assert.ok(res);
      finish();
    });
  },
  "test getSubmissionFile ": function (finish) {
    var $fh = {};

    var mockMbaasClient = {
      app: {
        submissions: {
          getFile: function (params, cb) {
            assert.equal(params.domain, process.env.FH_DOMAIN);
            assert.equal(params.environment, process.env.FH_ENV);
            assert.equal(params.fileId, "somefileid");
            assert.equal(params.id, "somesubmissionid");

            return cb(undefined, new mockReadStream());
          }
        }
      }
    };

    $fh.forms = proxyquire('../lib/forms.js', {'fh-mbaas-client': mockMbaasClient})(cfg);
    $fh.forms.getSubmissionFile({
      "id": "somesubmissionid",
      "fileId": "somefileid"
    }, function (err, resultStream) {
      assert.ok(!err);
      assert.ok(resultStream instanceof stream.Readable, "Expected A Readable Stream");
      finish();
    });
  }
};