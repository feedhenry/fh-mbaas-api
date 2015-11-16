/**
 * Init script responsible for setting required parameters
 */
module.exports = function init(logger) {
  var maxSocketCount = Infinity;
  if (process.env.NODE_MAX_SOCKETS_COUNT) {
    var count = process.env.NODE_MAX_SOCKETS_COUNT;
    if (isNaN(count)) {
      logger.error("Invalid NODE_MAX_SOCKETS_COUNT environment variable: " + count);
    } else {
      var count = Number(process.env.NODE_MAX_SOCKETS_COUNT);
      maxSocketCount = count;
    }
  }
  require('https').globalAgent.maxSockets = maxSocketCount;
  require('http').globalAgent.maxSockets = maxSocketCount;
};
