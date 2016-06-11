var express = require('express');
var app = express();
var serialport = require("serialport");
var http = require('https');
var execFile = require('child_process').execFile;
var request = require('request');
request = request.defaults({
    baseUrl: 'http://192.168.0.110:8080/api',
    auth: {
        user: 'pius1234',
        pass: 'Sm4rtC0ff332016!'
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

var coffeeMachine = {};
coffeeMachine.isStudentLoggedIn = false;
coffeeMachine.temperature = 0;
coffeeMachine.availableCoffees = 0;
coffeeMachine.coffeeFinishTimestamp = Date.now();
coffeeMachine.isBrewing = false;

var xxsrfToken = '';

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
                        if (response.statusCode == 409) {
                            //StatusCode 409, error: user is not mapped
                            console.log('Student not found');
                            //Message on Screen, that the card isn't mapped
                            lcdFirstRow = "Nicht gemapped";
                            setTimeout(function () {
                                lcdFirstRow = firstRowDefault;
                            }, 2000);
                        }

                        if (response.statusCode == 200) {
                            //StatusCode 200 user is mapped and exists on server
                            body = JSON.parse(body);
                            logInStudent(body.studentName, body.quota);
                            coffeeMachine.availableCoffees = body.fillLevel;
                            coffeeMachine.isBrewing = body.brewing;



                            /*
                                ToDo:   the following lines should be moevid in the LCD-1-Scond-Intervall.
                                        Because, if its brewing and you put your card to the Reader, just nothing happens ..
                                        What you describe here is just for the LCD-1-Second-Intervall  ...
                            */
                            if(body.brewing) {
                                //Add 30 Minutes to coffeeFinishTimestamp = 1800000 ms
                                //Admin setup new Coffee, coffee output should be delayed!
                                //show timer on lcd with time left time left = coffeeFinishTimestamp - Date.now()
                                coffeeMachine.coffeeFinishTimestamp = new Date(body.fillLevelDate + 1800000);
                                //TODO Show Timer on Display with remeaning time until the coffee is finished
                            } else {
                                coffeeMachine.coffeeFinishTimestamp = new Date(body.fillLevelDate);
                                //TODO show normal coffee state on display
                            }


                            
                        }
                        //TODO errorhandling for server request
                        if (error) {
                            console.log(error);

                            // ToDo: If you want to show the beginning (only 16chars) of the message on the screen:
                            /*
                            lcdFirstRow = error.substring(0, 16);
                            setTimeout(function () {
                                lcdFirstRow = firstRowDefault;
                            }, 3000);
                            */

                        }
                    });
            }
            readNfcTag();
        } else {
            if(coffeeMachine.isStudentLoggedIn == true) {
                console.log('no Tag');
                student.campusCardId = '';
                logOutStudent();
                request.get('campuscard');
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
                    createdAt: Date.now()

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

function postTelemetryData(telemetryData) {

    request.post({
            url: '/telemetry',
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            },
            body: telemetryData
        },
        function (error, response, body) {
            if (response.statusCode == 200) {
                console.log('Telemtry updated');
            }
            //TODO errorhandling for server request
            if (error) {
                console.log(error);
            }
        });
}

var emptyRow = "                ";
var lcdStudentInfoRow = "";
var lcdSecondRow = "2. Reihe";
var firstRowDefault = "SmartCoffee";
var lcdFirstRow = firstRowDefault;

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



function setLcdSecondRow() {
    if (coffeeMachine.availableCoffees > 0) {
        lcdSecondRow = coffeeMachine.temperature + "Grad  " + coffeeMachine.availableCoffees + "Kaffee" + "        ";
    } else {
        lcdSecondRow = "Kaffee ist leer!";
    }
}

lcd.on('ready', function () {
    setInterval(function () {
        setLcdSecondRow();
        lcd.setCursor(0, 0);
        var ausgabetext = lcdFirstRow + emptyRow;
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
    } else if (coffeeMachine.isBrewing) {
        //TODO show message on screen "Kaffee ist noch nicht fertig"
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
    request({
            method: 'POST',
            url: '/students/' + campusCardId + '/coffee-log',
            headers: {
                'x-xsrf-token': xxsrfToken
            }
        },
        function (error, response, body) {
            if (response.statusCode == 200) {
                var telemetryData = {
                    temperature: coffeeMachine.temperature,
                    fillLevel: coffeeMachine.availableCoffees,
                    brewing: false,
                    createdAt: Date.now()
                };
                postTelemetryData(JSON.stringify(telemetryData));
            }

            //TODO errorhandling for server request
            if (error) {
                console.log(error);
            }
        });
}
