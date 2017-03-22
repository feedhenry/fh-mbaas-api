var assert = require('assert');
var futils = require('../lib/fhutils');
var fhutils = new futils({});
var expect = require('chai').expect;
var clearRequire = require('clear-require');
var proxyquire = require('proxyquire');

module.exports = {
  'beforeEach': function () {
    clearRequire('../lib/fhutils');
  },


  'isLocal - return false': function () {
    futils = proxyquire('../lib/fhutils', {
      process: {
        env: {
          FH_STATS_PORT: 'value',
          FH_TITLE: 'value'
        }
      }
    });

    assert.equal(new futils({}).isLocal(), false);
  },

  'isLocal - return true if FH_USE_LOCAL_DB is "true"': function () {
    futils = proxyquire('../lib/fhutils', {
      process: {
        env: {
          FH_USE_LOCAL_DB: 'true'
        }
      }
    })

    assert.equal(new futils({}).isLocal(), true);
  },

  'isLocal - return true if expected platform vars are not set': function () {
    futils = proxyquire('../lib/fhutils', {
      process: {
        env: {}
      }
    })

    assert.equal(new futils({}).isLocal(), true);
  },

  'test addAppApiKeyHeader - without override': function () {
    var fhutils = new futils({
      APP_API_KEY_HEADER: 'x-fh-api-key',
      fhapi: {
        appapikey: 'thedefaultapikey'
      }
    });

    var headers = {
      'x-custom-header': 'rhmap rocks'
    };

    fhutils.addAppApiKeyHeader(headers);

    expect(headers).to.deep.equal({
      'x-custom-header': 'rhmap rocks',
      'x-fh-api-key': 'thedefaultapikey'
    });
  },

  'test addAppApiKeyHeader - with override': function () {
    var fhutils = new futils({
      APP_API_KEY_HEADER: 'x-fh-api-key',
      fhapi: {
        appapikey: 'thedefaultapikey'
      }
    });

    var headers = {
      'x-custom-header': 'rhmap rocks'
    };

    var customApiKey = 'thecustomapikey';

    fhutils.addAppApiKeyHeader(headers, customApiKey);

    expect(headers).to.deep.equal({
      'x-custom-header': 'rhmap rocks',
      'x-fh-api-key': customApiKey
    });
  },

  'test urlPathJoin': function(finish) {

    assert.equal(fhutils.urlPathJoin('/p1', '/p2'),              "/p1/p2");
    assert.equal(fhutils.urlPathJoin('p1', '/p2'),               "/p1/p2");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2'),               "/p1/p2");
    assert.equal(fhutils.urlPathJoin('p1', 'p2'),                "/p1/p2");
    assert.equal(fhutils.urlPathJoin('/p1/', '/p2'),              "/p1/p2");
    assert.equal(fhutils.urlPathJoin('p1/', '/p2'),               "/p1/p2");
    assert.equal(fhutils.urlPathJoin('/p1/', 'p2'),               "/p1/p2");
    assert.equal(fhutils.urlPathJoin('p1/', 'p2'),                "/p1/p2");
    assert.equal(fhutils.urlPathJoin('/p1/p2', '/p3'),           "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1/p2/', '/p3'),          "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1/p2/', 'p3'),           "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2', '/p3'),       "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('p1', '/p2', '/p3'),        "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2', '/p3'),        "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2', 'p3'),        "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('p1', 'p2', 'p3'),          "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2', '/p3'),        "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2/p3'),           "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2/p3'),            "/p1/p2/p3");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2', '/p3', 'p4'), "/p1/p2/p3/p4");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2/'),              "/p1/p2/");
    assert.equal(fhutils.urlPathJoin('p1', '/p2/'),               "/p1/p2/");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2/'),               "/p1/p2/");
    assert.equal(fhutils.urlPathJoin('p1', 'p2/'),                "/p1/p2/");
    assert.equal(fhutils.urlPathJoin('/p1/p2', '/p3/'),           "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1/p2/', '/p3/'),          "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1/p2/', 'p3/'),           "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2', '/p3/'),       "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('p1', '/p2', '/p3/'),        "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2', '/p3/'),        "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2', 'p3/'),        "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('p1', 'p2', 'p3/'),          "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2', '/p3/'),        "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2/p3/'),           "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1', 'p2/p3/'),            "/p1/p2/p3/");
    assert.equal(fhutils.urlPathJoin('/p1', '/p2', '/p3', 'p4/'), "/p1/p2/p3/p4/");
    finish();
  }
};
