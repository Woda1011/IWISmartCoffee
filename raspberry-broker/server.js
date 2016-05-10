var express = require('express');
var app = express();
var serialport = require("serialport");
var http = require('https');
var execFile = require('child_process').execFile;
var request = require('request');
var lcdscreen = require('lcd');

var lcd = new lcdscreen({
    rs: 12,
    e: 21,
    data: [5, 6, 4, 18],
    cols: 16,
    rows: 2
});

var Leerzeichen = "                ";
var LCD_Zeile_1_Text_Default = "SmartCoffee";
var LCD_Zeile_1_Text = LCD_Zeile_1_Text_Default;
var LCD_Zeile_1_Text_Studentname_Kaffeekontingent = "";
var LCD_Zeile_2_Text = "2. Reihe";


function setLCD_Zeile_1_Text_Studentname_Kaffeekontingent() {
    LCD_Zeile_1_Text_Studentname_Kaffeekontingent = "Hi " + logged_in_student.first_name + Leerzeichen;

    Ausgabetext = LCD_Zeile_1_Text;

    if (coffeeMachine.student_logged_in == true) {
        if (logged_in_student.contingent < 10) {
            LCD_Zeile_1_Text_Studentname_Kaffeekontingent = LCD_Zeile_1_Text_Studentname_Kaffeekontingent.substring(0, 13) +
                "(" + logged_in_student.contingent + ")";
        }
        else {
            LCD_Zeile_1_Text_Studentname_Kaffeekontingent = LCD_Zeile_1_Text_Studentname_Kaffeekontingent.substring(0, 12) +
                "(" + logged_in_student.contingent + ")";
        }
    }
}

function setRow_1() {
}

function setRow_2() {
    if (coffeeMachine.available_coffees > 0) {
        LCD_Zeile_2_Text = coffeeMachine.temperature + "Grad  " + coffeeMachine.available_coffees + "Kaffee" + "        ";
    }
    else {
        LCD_Zeile_2_Text = "Mach mehr Kaffee! ";
    }
}


//Clock
lcd.on('ready', function () {
    setInterval(function () {
        setRow_2();

        lcd.setCursor(0, 0);
        Leerzeichen = "                ";
        Ausgabetext = LCD_Zeile_1_Text + Leerzeichen;


        lcd.print(Ausgabetext.substring(0, 16));

        lcd.once('printed', function () {
            lcd.setCursor(0, 1); // col 0, row 1
            lcd.print(LCD_Zeile_2_Text.substring(0, 16)); // print date
        });
    }, 1000);
});

function logInStudent(name, coffeeContingent) {

    coffeeMachine.student_logged_in = true;
    logged_in_student.first_name = name;
    logged_in_student.contingent = coffeeContingent;

    setLCD_Zeile_1_Text_Studentname_Kaffeekontingent();

    setTimeout(function () {
        LCD_Zeile_1_Text_Default = LCD_Zeile_1_Text_Studentname_Kaffeekontingent;
        LCD_Zeile_1_Text = LCD_Zeile_1_Text_Default;
    }, 30);

    intern_led.writeSync(1);
    //Wenn noch Kaffee da ist der Student noch Kontingent hat soll der Button leuchten
    if (logged_in_student.contingent > 0 && coffeeMachine.available_coffees > 0) {
        button_led.writeSync(1);
    }
}

function logOutStudent() {

    coffeeMachine.student_logged_in = false;
    logged_in_student.first_name = "";
    logged_in_student.contingent = 0;

    LCD_Zeile_1_Text = "Ausgeloggt";

    intern_led.writeSync(0);
    button_led.writeSync(0);

    setTimeout(function () {
        LCD_Zeile_1_Text_Default = "SmartCoffee";
        LCD_Zeile_1_Text = LCD_Zeile_1_Text_Default;
    }, 1500);

}


/*
 lcd.on('ready', function() {
 lcd.setCursor(16, 0);
 lcd.autoscroll();
 print('SmartCoffee@HsKa - 7Kaffee verfuegbar - Temperatur 65C ');
 });
 */


function print(str, pos) {
    pos = pos || 0;

    if (pos === str.length) {
        pos = 0;
    }

    lcd.print(str[pos]);

    setTimeout(function () {
        print(str, pos + 1);
    }, 300);
}

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function () {
    lcd.clear();
    lcd.close();
    process.exit();
});


var options = {
    host: '127.0.0.1',
    port: '8080',
    //host: 'www.smartcoffee.event-news.org',
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
};

var currentStudent = {
    campusCardId: ''
};

app.listen(3000, function () {
    console.log('Raspberry-Broker listening on port 3000!');
});

read();

function read() {
    execFile('nfc-list', function (error, stdout, stderr) {
        var searchString = '(NFCID1):';

        if (stdout.indexOf(searchString) >= 0) {
            var tempString = stdout.slice(stdout.indexOf(searchString));
            var campusCardId = tempString.substring(tempString.indexOf(':') + 1, tempString.indexOf('\n'));

            campusCardId = campusCardId.trim();
            campusCardId = campusCardId.replace(/ /g, '');
            console.log('Tag detected with UID: ' + campusCardId);

            if (campusCardId != currentStudent.campusCardId) {
                currentStudent.campusCardId = campusCardId;

                request.get({
                        url: 'http://192.168.0.109:8080/api/students/' + currentStudent.campusCardId + '/coffee-log'
                    },
                    function (error, response, body) {
                        if (response.statusCode == 409) {
                            //StatusCode 409, error: user is not mapped
                            console.log('Student not found');
                        }

                        if (response.statusCode == 200) {
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

function postTelemetryData(sensorData) {

    options.path = '/api/telemetry';

    var request = http.request(options, function (response) {
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
