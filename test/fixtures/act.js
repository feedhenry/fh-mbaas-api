var nock = require('nock');

var actReplies = {
  act : function(path, body){
    return {
      hosts : {
        "live-url" : "https://localhost:443/act/live",
        "development-url" : "https://localhost:443/act/dev"
      }
    };
  },
  live : function(path, body){
    return body;
  },
  dev : function(path, body){
    return body;
  },
  ping : function(path, body){
    return { ok : true};
  }
};
module.exports = nock('https://localhost:443')
.filteringRequestBody(function(path) {
  return '*';
})
.post('/box/srv/1.1/ide/apps/app/hosts', '*')
.times(2)
.reply(200, actReplies.act)
.post('/act/dev/cloud/doSomething', '*')
.reply(200, actReplies.live)
.post('/act/live/cloud/doSomething', '*')
.reply(200, actReplies.dev)
.post('/box/srv/1.1/sys/info/ping', '*')
.reply(200, actReplies.ping);