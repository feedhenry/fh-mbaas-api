// Copyright (c) FeedHenry 2011

var util = require('util');
var assert = require('assert');
var request = require('request');

var webapp = require('../node_modules/fh-webapp/lib/webapp.js');
var express = require('express');
var mainjs = require('./fixtures/main.js');
//$fh = require('fh-api'); // TODO: Write fh-api

var app = express();
//app.use(express.bodyParser()); // this causes issues. Why?
app.use('/sys', webapp.sys(mainjs));
app.use('/mbass', webapp.mbaas);
app.use('/cloud', webapp.cloud(mainjs));


module.exports = {
  // BIG TODO - very brittle - refactor with test millicore or dynamically get ids, cookie, etc
//  'test fh.feed() ': function(test, assert) {
//    request.post('http://localhost:3000/cloud/getFeed/',{
//      headers : {
//        'Content-Type' : 'application/json'
//      }
//    }, function(err, res, body){
//      console.log(arguments);
//      assert.ok(!err);
//      var out = JSON.parse(body);
//      assert.equal(out.list.length, 10);
//      test.finish();
//    });
//  }
//  'test fh.feed() bad args': function() {
//    var gotException = false;
//    try {
//      fhserver.feed({});
//    } catch (x) {
//      gotException = true;
//    }
//    assert.equal(gotException, true);
//  }
};
