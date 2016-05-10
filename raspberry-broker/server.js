var express = require('express');
var app = express();
var serialport = require("serialport");
var http = require('https');
var execFile = require('child_process').execFile;
var request = require('request');

var options = {
    host: '127.0.0.1',
    port: '8080',
    //host: 'www.smartcoffee.event-news.org',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

var currentStudent = {
    campusCardId: ''
};

app.listen(3000, function () {
    console.log('Raspberry-Broker listening on port 3000!');
});

read();

function read() {

  execFile('nfc-list', function(error, stdout, stderr) {
      var searchString = '(NFCID1):';

      if(stdout.indexOf(searchString) >= 0) {
          var tempString = stdout.slice(stdout.indexOf(searchString));
          var campusCardId = tempString.substring(tempString.indexOf(':')+1, tempString.indexOf('\n'));

          campusCardId = campusCardId.trim();
          campusCardId = campusCardId.replace(/ /g,'');
          console.log('Tag detected with UID: ' + campusCardId);

          if(campusCardId != currentStudent.campusCardId) {
              currentStudent.campusCardId = campusCardId;

              request.get({
                      url:'http://192.168.0.109:8080/api/students/' + currentStudent.campusCardId + '/coffee-log'},
                  function(error, response, body){
                      if(response.statusCode == 409) {
                          //StatusCode 409, error: user is not mapped
                          console.log('Student not found');
                      }

                      if(response.statusCode == 200) {
                          //StatusCode 200 user is mapped and exists on server
                          console.log(body);
                      }

                      console.log(error);

              }).auth('woda1017', 'woda1017');


              //TODO Send request to the server, check if ID is Mapped to a Student, If not show message on display, else verfify if student has enough coins
              //TODO show coins on screen
              //TODO enable coffeeoutput button
              //TODO remove one coin if the student pushes the button.
              //TODO disable coffeeoutput button
              //TODO show left coffecoins on screen
              //TODO say thank youu on screen
              //TODO Restart poll process
          }
          read();
      } else {
          console.log('no Tag');
          currentStudent.campusCardId = '';
          read();
      }
    //TODO parse error
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
