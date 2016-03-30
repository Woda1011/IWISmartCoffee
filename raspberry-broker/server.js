var express = require('express');
var app = express();

var serialport = require("serialport");

//TODO create function to read active usb ports to figure out the arduinos path
var serial = new serialport.SerialPort("COM3", {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
});

serial.on("open", function () {
    console.log('serial port is now open');
    serial.on('data', function (data) {
        //TODO parse JSON Object and prepare it for rest call
        //TODO errorhandling vom arduino if it prints something else than json on the serialport
        console.log('data received: ' + data);
    });
});

app.get('/', function (req, res) {
    res.send('Hello World! from my Computer!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
