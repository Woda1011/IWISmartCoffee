var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World! Here ist the backend-node-mock!');
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
