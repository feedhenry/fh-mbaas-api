var _ = require('underscore');

module.exports = function(grunt) {
  'use strict';

  function makeTestArgs(testFile) {
    return ['-u exports --recursive -t 10000 ./test/setup.js', testFile].join(' ');
  }

  function makeUnits(testArgString) {
    return [test_runner, testArgString].join(' ');
  }

  function makeUnitCovers(testArgString) {
    return ['istanbul cover --dir cov-unit', test_runner, '--', testArgString].join(' ');
  }

  // TODO: move these to use the grunt-mocha-test plugin

  var tests = [    /* If updating this list of tests, also update test_win.cmd for Windows */
    './test/test_fhutils.js',
    './test/test_fhact.js',
    './test/test_fhdb.js',
    './test/test_fhforms.js',
    './test/test_fhsec.js',
    './test/test_fhsession.js',
    './test/test_fhstat.js',
    './test/test_cache.js',
    './test/test_redis.js',
    './test/test_fhauth.js',
    './test/test_init.js',
    './test/test_fhpush.js',
    './test/test_sync_api.js'
  ];
  var unit_args = _.map(tests, makeTestArgs);
  var test_runner = '_mocha';

  // Just set shell commands for running different types of tests
  grunt.initConfig({
    mochaTest: {
      integration: {
        options: {
          ui: 'exports',
          reporter: 'spec',
          timeout: 30000
        },
        src: ['integration/**/test*.js']
      }
    },

    // These are the properties that grunt-fh-build will use
    unit: _.map(unit_args, makeUnits),
    unit_cover: _.map(unit_args, makeUnitCovers)
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-fh-build');
  //do not run fh:integrate as there are no integration tests to run, and the task will cause the build to fail due to warning on node8+
  grunt.registerTask('default', ['eslint', 'fh:unit', 'fh:dist']);
};
