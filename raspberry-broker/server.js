var express = require('express');
var app = express();
var serialport = require("serialport");
var http = require('https');
var execFile = require('child_process').execFile;
var request = require('request');
request = request.defaults({
    baseUrl: 'http://192.168.0.103:8080/api',
    auth: {
        user: 'pius1234',
        pass: 'Sm4rtC0ff332016'
    },
    jar:true
});

var lcdscreen = require('lcd');
var lcd = new lcdscreen({
    rs: 12,
    e: 21,
    data: [5, 6, 4, 18],
    cols: 16,
    rows: 2
});

var student = {
    name: '',
    quota: 0,
    campusCardId: ''
};

var xxsrfToken = '';

app.listen(3000, function () {
    console.log('Raspberry-Broker listening on port 3000!');
});

readNfcTag();

function extractCampusCardId(stdout, searchString) {
    var tempString = stdout.slice(stdout.indexOf(searchString));
    var campusCardId = tempString.substring(tempString.indexOf(':') + 1, tempString.indexOf('\n'));

    campusCardId = campusCardId.trim();
    campusCardId = campusCardId.replace(/ /g, '');
    console.log('Tag detected with UID: ' + campusCardId);
    return campusCardId;
}

function readNfcTag() {
    function hasCampusCardIdChanged(campusCardId) {
        return campusCardId != student.campusCardId;
    }

    function isCampusCardDetected(consoleOutput, searchString) {
        return consoleOutput.indexOf(searchString) >= 0;
    }

    execFile('nfc-list', function (error, stdout, stderr) {
        const searchString = '(NFCID1):';

        if (isCampusCardDetected(stdout, searchString)) {
            var campusCardId = extractCampusCardId(stdout, searchString);

            if (hasCampusCardIdChanged(campusCardId)) {
                student.campusCardId = campusCardId;

                request.get({
                        url: '/students/' + student.campusCardId + '/coffee-log'
                    },
                    function (error, response, body) {
                        xxsrfToken = response.headers['x-xsrf-token'];
                        console.log(body);
                        if (response.statusCode == 409) {
                            //StatusCode 409, error: user is not mapped
                            console.log('Student not found');
                            //TODO update Message on Screen "Deine Karte ist noch nicht zugeordnet..."
                        }

                        if (response.statusCode == 200) {
                            //StatusCode 200 user is mapped and exists on server
                            body = JSON.parse(body);
                            logInStudent(body.studentName, body.quota);
                        }
                        //TODO errorhandling for server request
                        if (error) {
                            console.log(error);
                        }
                    });
            }
            readNfcTag();
        } else {
            if(coffeeMachine.isStudentLoggedIn == true) {
                console.log('no Tag');
                student.campusCardId = '';
                logOutStudent();
                //TODO waiting for new Server API
                request.get('/students/' + student.campusCardId + '/coffee-log');
            }
            readNfcTag();
        }
        //TODO parse stderror
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

    var options = {
        host: '127.0.0.1',
        port: '8080',
        //host: 'www.smartcoffee.event-news.org',
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    };

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

var emptyRow = "                ";
var lcdStudentInfoRow = "";
var lcdSecondRow = "2. Reihe";
var firstRowDefault = "SmartCoffee";
var lcdFirstRow = firstRowDefault;

var coffeeMachine = {};
coffeeMachine.isStudentLoggedIn = false;
coffeeMachine.temperature = 57;
coffeeMachine.availableCoffees = 200;
coffeeMachine.coffeeFinishTimestamp = Date.now();

//Todo method for student greetings, this occurs when a student places his card on the reader First Row "Hi {name} Second Row "Guthaben: {quota}"
//Todo method for sutdents, if the card is not mapped on the server
//Todo default message if no student is logged in

//Todo export method method to set First Row
function setLcdFirstRowStudentInfo() {
    lcdStudentInfoRow = "Hi " + student.name + emptyRow;
    ausgabetext = lcdFirstRow;

    if (coffeeMachine.isStudentLoggedIn == true) {
        if (student.quota < 10) {
            lcdStudentInfoRow = lcdStudentInfoRow.substring(0, 13) +
                "(" + student.quota + ")";
        } else {
            lcdStudentInfoRow = lcdStudentInfoRow.substring(0, 12) +
                "(" + student.quota + ")";
        }
    }
}

//Todo export
function setLcdSecondRow() {
    if (coffeeMachine.availableCoffees > 0) {
        lcdSecondRow = coffeeMachine.temperature + "Grad  " + coffeeMachine.availableCoffees + "Kaffee" + "        ";
    } else {
        lcdSecondRow = "Mach mehr Kaffee! ";
    }
}

lcd.on('ready', function () {
    setInterval(function () {
        setLcdSecondRow();
        lcd.setCursor(0, 0);
        ausgabetext = lcdFirstRow + emptyRow;
        lcd.print(ausgabetext.substring(0, 16));
        lcd.once('printed', function () {
            lcd.setCursor(0, 1); // col 0, row 1
            lcd.print(lcdSecondRow.substring(0, 16)); // print date
        });
    }, 1000);
});

function logInStudent(name, coffeeContingent) {
    coffeeMachine.isStudentLoggedIn = true;
    student.name = name;
    student.quota = coffeeContingent;

    setLcdFirstRowStudentInfo();
    setTimeout(function () {
        firstRowDefault = lcdStudentInfoRow;
        lcdFirstRow = firstRowDefault;
    }, 30);

    intern_led.writeSync(1);
    //Wenn noch Kaffee da ist der Student noch Kontingent hat soll der Button leuchten
    if (student.quota > 0 && coffeeMachine.availableCoffees > 0) {
        button_led.writeSync(1);
    }
}

function logOutStudent() {
    coffeeMachine.isStudentLoggedIn = false;
    student.name = "";
    student.quota = 0;
    lcdFirstRow = "Ausgeloggt";

    intern_led.writeSync(0);
    button_led.writeSync(0);
    setTimeout(function () {
        firstRowDefault = "SmartCoffee";
        lcdFirstRow = firstRowDefault;
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

/*
 *      ------ ONOFF - FUER KOMMUNIKATION MIT GPIOs ------
 */
var Gpio = require('onoff').Gpio,
    button_led = new Gpio(26, 'out'),
    intern_led = new Gpio(20, 'out'),
    output_water = new Gpio(23, 'out'),
    button = new Gpio(22, 'in', 'rising');

/*
 *      ------ ONOFF - FUER KOMMUNIKATION MIT 433HZ Modul ------
 */
var rpi433 = require('rpi-433'),
    rfSniffer = rpi433.sniffer(17, 500), //Sniff on PIN 17 with a 500ms debounce delay
    rfSend = rpi433.sendCode;

// Receive
rfSniffer.on('codes', function (code) {
    console.log('Code received: ' + code);
});

// Send
/*
 rfSend(5393, 0, function(error, stdout) {   //Send 1234
 if(!error) console.log(stdout); //Should display 1234
 });
 */

button.watch(function (err, value) {
    if (err) {
        throw err;
    }
    else {
        get_coffee();
    }
});

//Zeigt an, ob gerade ein Kaffee rausgelassen wird
var coffee_output_in_use = false;

//Funktion welche die Ausgabe des Kaffees regelt
function get_coffee(){
    //Es wird gerade Kaffee rausgelassen
    if (coffee_output_in_use == true) {
        console.log("Bitte Warten - Kaffee wird bereits ausgegeben!");
    }
    //Kaffeemaschine ist leer
    else if (coffeeMachine.availableCoffees <= 0) {
        console.log("Kaffetopf ist leer - bitte wieder auffüllen!");
        lcdFirstRow = "Kaffee leer!         ";
        lcdSecondRow = "Mach neuen Kaffee!";
    }
    //Student ist nicht eingeloggt
    else if (coffeeMachine.isStudentLoggedIn == false) {
        console.log("Kein Student eingeloggt! - Bitte einloggen");
        lcdFirstRow = "Bitte Einloggen!";
        setTimeout(function () {
            lcdFirstRow = firstRowDefault;
        }, 2000);
    }
    //Student ist eingeloggt, aber kein Kaffee kontingent mehr
    else if (student.quota <= 0) {
        console.log("Student hat kein Kaffeekontingent mehr und sollte sich jetzt schleunigst welches auffüllen, will er nicht einen schmerzvollen Ermüdungstod sterben");
        lcdFirstRow = "Kontingent leer!";
        setTimeout(function () {
            lcdFirstRow = firstRowDefault;
        }, 2000);
    }
    //Student ist eingeloggt und hat noch Kaffeekontingent
    else {
        //Weitere Kaffeeausgabeversuche waehrend der Ausgabe blockieren
        coffee_output_in_use = true;
        //Kaffeeausgabe starten
        output_water.writeSync(1);
        console.log("Kaffee marsch !!");
        lcdFirstRow = "Kaffee !!!!";
        //Button LED ausmachen um zu singnalisieren, dass man sich gerade keinen Kaffee bestellen kann
        button_led.writeSync(0);
        setTimeout(function () {
            output_water.writeSync(0);
            console.log("Kaffee stopp !!");
            lcdFirstRow = "Kaffee fertig!";
            coffeeMachine.availableCoffees--;
            student.quota--;

            //Wenn der Student noch Kontingent hat soll der Button leuchten
            if (student.quota <= 0 || coffeeMachine.availableCoffees <= 0) {
                button_led.writeSync(0);
            }

            updateCoffeeLogForStudent(student.campusCardId);
            setTimeout(function () {
                //lcdStudentInfoRow wieder auf  Basisinfodaten des Studenten zurücksetzen "Name  (KaffeekontingentAnz)""
                setLcdFirstRowStudentInfo();
                firstRowDefault = lcdStudentInfoRow;
                lcdFirstRow = firstRowDefault;

                //Kaffeeausgabe wieder auf false setzte. Ab jetzt kann wieder Kaffee geortert weden
                coffee_output_in_use = false;
                console.log("Now you can get moooooore Coffee");

                //Wenn noch Kaffee da ist der Student noch Kontingent hat soll der Button leuchten
                if (student.quota > 0 && coffeeMachine.availableCoffees > 0) {
                    button_led.writeSync(1);
                }
            }, 3000);
        }, 1500);
    }
}

function updateCoffeeLogForStudent(campusCardId) {
    console.log('updating quota');
    request({
            method: 'POST',
            url: '/students/' + campusCardId + '/coffee-log',
            headers: {
                'x-xsrf-token': xxsrfToken
            }
        },
        function (error, response, body) {
            if (response.statusCode == 409) {
                //StatusCode 409, error: user is not mapped
                console.log('Student not found');
                //TODO
            }

            if (response.statusCode == 200) {
                console.log('Quota updated');
            }

            //TODO errorhandling for server request
            if (error) {
                console.log(error);
            }
        });
}
