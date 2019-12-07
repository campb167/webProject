var koa = require('koa');
var app = new koa();

var express = require('express');
var app = express();

const path = require('path');
app.use(express.static('html'));

app.get('/', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/home.html'));
});
app.get('/about', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/about.html'));
});
app.get('/team', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/team.html'));
});
app.get('/store', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/store.html'));
});
app.get('/support', function(req, res) {   
    res.sendFile(path.join(__dirname+'/html/support.html'));
});

var port = process.env.PORT || 3000
app.listen(port, function(){
    console.log('Server running on http://localhost:3000')
});