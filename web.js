var express = require('express');
var fs = require('fs');
var Buffer = require('buffer').Buffer;

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var data = fs.readFileSync('./index.html', 'utf8');
  var bufferdata = new Buffer(data);
  response.send(bufferdata.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
