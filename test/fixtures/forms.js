var assert = require('assert');
var events = require('events');
var _ = require('underscore');


var formEventListeners = [];

module.exports = {
  initEnvironment: function(environment, mbaasConf){
    assert.ok(environment);
    assert.ok(mbaasConf);
  },
  app: {
    forms: {
      list: function(options, cb){
        assert.ok(options, "Expected options but got nothing");
        return cb(undefined, [])
      },
      get: function(options, cb){
        assert.ok(options, "Expected options but got nothing");
        assert.ok(options.id, "Expected form id but got nothing");
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
      submitFormData: function (options, cb) {
        assert.ok(options);
        assert.ok(options.id);
        assert.ok(options.submission);

        cb(undefined, {"submissionId": "submissionId123456"});
      },
      search: function(options, cb){
        assert.ok(options.searchParams, "Expected searchParams but got nothing");
        return cb(undefined, []);
      }
    },
    themes: {
      get: function(options, cb){
        assert.ok(options, "Expected options but got nothing");
        cb(undefined, {"_id": "someThemeId"});
      }
    },
    submissions: {
      uploadFile: function(options, cb){
        assert.ok(options, "Expected options but got nothing");
        assert.ok(options.id);
        assert.ok(options.fieldId);
        assert.ok(options.fileId);
        assert.ok(options.fileDetails.stream);
        assert.ok(options.fileDetails.size);
        assert.ok(options.fileDetails.type);
        assert.ok(options.fileDetails.name);
        cb(undefined, {"status": "ok"});
      },
      complete: function(options, cb){
        assert.ok(options.id);

        cb(undefined, {"status": "complete"});
      },
      status: function(options, cb){
        assert.ok(options.id);

        cb(undefined, {"status": "pending"});
      },
      search: function(options, cb){
        assert.ok(options.searchParams, "Expected subids but got nothing");

        return cb(undefined, []);
      },
      get: function(options, cb){
        assert.ok(options.id, "Expected options._id but got nothing");
        cb(undefined, {});
      },
      getFile: function(options, cb){
        assert.ok(options.fileId, "Expected filegroupId but got nothing");
        return cb(undefined, {
          stream: "fileStream",
          type: "contentType",
          length: 122
        });
      }
    },
    formsConfig: {
      get: function(options, cb){
        return cb(undefined, {client: {
          clientKey: "someClientVal"
        },
        cloud: {
          cloudKey: "someCloudVal"
        }});
      }
    }
  }
};