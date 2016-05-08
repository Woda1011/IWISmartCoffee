var express = require('express');
var app = express();
var serialport = require("serialport");
var http = require('https');
var execFile = require('child_process').execFile;

var options = {
    //host: '127.0.0.1',
    //port: '8080',
    host: 'www.smartcoffee.event-news.org',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};


read();

function read() {

  execFile('nfc-list', function(error, stdout, stderr) {
      var searchString = '(NFCID1):';
      if(stdout.indexOf(searchString) >= 0) {
          //ID found, so someone placed a card on the reader --> extract ID
          //recursice function
          var tempString = stdout.slice(stdout.indexOf(searchString));

          var uid = tempString.substring(tempString.indexOf(':')+1, tempString.indexOf('\n'));
          console.log('Tag detected with UID: ' + uid);

          //TODO Convert 4 Byte Hex Code to Decimal
          //TODO 3. If an ID is available send request to the server, if not show message on screen, and poll again
          read();
      } else {
          console.log('no Tag');
          read();
      }
    //TODO parse error
    //Child_Process von Spawn ist Zu Ende, neuen Prozess starten
  });
}

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
        if (!!port.manufacturer) {
            console.log('checking port:' + port.manufacturer);
            console.log('port:' + port.comName);
            if (port.manufacturer.indexOf("Arduino") >= 0) {
                openSerialPort(port.comName);
            }
        }
    });
});

app.listen(3000, function () {
    console.log('Raspberry-Broker listening on port 3000!');
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
