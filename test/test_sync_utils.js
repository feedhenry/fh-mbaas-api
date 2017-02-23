var sinon = require('sinon');
var expect = require('chai').expect;
var mod;

module.exports = {
  beforeEach: function () {
    // Clear all require cache to ensure old datasets etc. aren't hanging about
    require('clear-require').all();

    // Creates a new sync instance
    mod = require('../lib/sync-util');
  },

  '#ensureHandlerIsFunction': {
    'should throw an AssertionError if not passed a function': function () {
      expect(function () {
        mod.ensureHandlerIsFunction('listHandler', {});
      }).to.throw(
        'AssertionError: sync handler (listHandler) must be a function'
        );
    },
    'should not throw an AssertionError if passed a function': function () {
      expect(function () {
        mod.ensureHandlerIsFunction('listHandler', sinon.spy());
      }).to.not.throw();
    }
  },

  '#ensureAsyncGenerateHashIsCorrect': {
    'should generate identical hash to sync version': function (done) {
      // Simple object to produce hash from
      var testObject = {
        testKey: 'testValue'
      };

      mod.asyncGenerateHash(testObject, function(err, asyncHash) {
        var syncHash = mod.generateHash(testObject);

        expect(asyncHash).to.equal(syncHash);
        done();
      });
    }
  }
};