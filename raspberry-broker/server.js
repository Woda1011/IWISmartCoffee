var express = require('express');
var app = express();
var serialport = require("serialport");
var http = require('https');

var options = {
    //host: '127.0.0.1',
    //port: '8080',
    host: 'www.smartcoffee.event-news.org',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};


function openSerialPort(portName) {
    var serial = new serialport.SerialPort(portName, {
        baudrate: 9600,
        parser: serialport.parsers.readline('\n')
    });

    serial.on("open", function () {
        console.log('serial port is now open');
        serial.on('data', function (data) {

            try {
                var jsonData = JSON.parse(data);
                var telemetryData = {
                        temperature: jsonData.temperature,
                        humidity: jsonData.humidity,
                        createdAt: new Date().getTime()

                };
                postTelemetryData(JSON.stringify(telemetryData));
                console.log('data received: ' + JSON.stringify(telemetryData));
            } catch (err) {
                console.error('Error parsing Data from Arduino: ' + data);
                console.error(err);
            }
        });
    });
}

serialport.list(function (err, ports) {
    if (err) {
        throw err;
    }

    ports.forEach(function (port) {
        if (port.manufacturer.indexOf("Arduino") >= 0) {
            openSerialPort(port.comName);
        }
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function postTelemetryData(sensorData){

    options.path = '/api/telemetry';

    var request = http.request(options, function(response) {
        console.log('STATUS: ' + response.statusCode);
        response.on('data', function (data) {
            console.log('BODY: ' + data);
        });

        response.on('error', function (error) {
            //TODO errorhandling for connection timeout
            console.error(error)
        });
    });

    request.write(sensorData);
    request.end();
}
