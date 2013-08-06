var webapp = require('../../node_modules/fh-webapp/lib/webapp.js');
var express = require('express');
var mainjs = require('./main.js');
//$fh = require('fh-api'); // TODO: Write fh-api

var app = express();
//app.use(express.bodyParser()); // this causes issues. Why?
app.use('/sys', webapp.sys(mainjs));
app.use('/mbass', webapp.mbaas);
app.use('/cloud', webapp.cloud(mainjs));

module.exports = app.listen(3000);