'use strict';

var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('$fh.host', function () {
  var host, stubs, result, appGuid;

  beforeEach(function () {
    require('clear-require').all();

    result = 'http://abc-dev.redhatmobile.com';

    appGuid = 'abc'

    stubs = {
      'fh-instance-url': {
        getUrl: sinon.stub().yields(null, result)
      },
      process: {
        env: {
          FH_INSTANCE: appGuid
        }
      }
    };

    host = proxyquire('lib/host.js', stubs);
  });

  it('should lookup the current host if no guid is provided', function (done) {
    host(function (err, url) {
      expect(url).to.equal(result);
      expect(stubs['fh-instance-url'].getUrl.getCall(0).args[0].guid).to.equal(
        appGuid
      );
      done();
    });
  });

  it('should lookup the host for a given guid', function (done) {
    result = 'http://cde-dev.redhatmobile.com';
    appGuid = 'cde'

    host(appGuid, function (err, url) {
      expect(url).to.equal(result);
      expect(stubs['fh-instance-url'].getUrl.getCall(0).args[0].guid).to.equal(
        appGuid
      );
      done();
    });
  });
});
