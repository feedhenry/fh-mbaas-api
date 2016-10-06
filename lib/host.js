'use strict';

var process = require('process');

/**
 * Returns the host URL for this app, or an application with the given guid
 * @param  {String}   guid
 * @param  {Function} cb
 * @return {undefined}
 */
module.exports = function host (guid, cb) {
  // Allow lookup of any guid on this domain
  if (typeof guid === 'function') {
    cb = guid;
    guid = process.env.FH_INSTANCE;
  }

  require('fh-instance-url')({
    guid: guid
  }, cb);
}
