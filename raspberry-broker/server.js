var express = require('express');
var app = express();
var serialport = require("serialport");
var http = require('https');
var execFile = require('child_process').execFile;
var request = require('request');
var lcdscreen = require('lcd');

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

var lcd = new lcdscreen({
    rs: 12,
    e: 21,
    data: [5, 6, 4, 18],
    cols: 16,
    rows: 2
});

var emptyRow = "                ";
var lcdFirstRowDefault = "SmartCoffee";
var lcdFirstRow = lcdFirstRowDefault;
var lcdStudentInfoRow = "";
var lcdSecondRow = "2. Reihe";

var coffeeMachine = {};
coffeeMachine.student_logged_in = false;
coffeeMachine.temperature = 57;
coffeeMachine.available_coffees = 2;
coffeeMachine.coffee_finish_timestamp = Date.now();

var logged_in_student = {};
logged_in_student.first_name = "";
logged_in_student.contingent = 0;


function setLcdFirstRowStudentInfo() {
    //TODO logged in student
    lcdStudentInfoRow = "Hi " + logged_in_student.first_name + emptyRow;

    Ausgabetext = lcdFirstRow;

    if (coffeeMachine.student_logged_in == true) {
        if (logged_in_student.contingent < 10) {
            lcdStudentInfoRow = lcdStudentInfoRow.substring(0, 13) +
                "(" + logged_in_student.contingent + ")";
        }
        else {
            lcdStudentInfoRow = lcdStudentInfoRow.substring(0, 12) +
                "(" + logged_in_student.contingent + ")";
        }
    }
}

function setLcdSecondRow() {
    if (coffeeMachine.available_coffees > 0) {
        lcdSecondRow = coffeeMachine.temperature + "Grad  " + coffeeMachine.available_coffees + "Kaffee" + "        ";
    }
    else {
        lcdSecondRow = "Mach mehr Kaffee! ";
    }
}

lcd.on('ready', function () {
    setInterval(function () {
        setLcdSecondRow();

        lcd.setCursor(0, 0);
        emptyRow = "                ";
        Ausgabetext = lcdFirstRow + emptyRow;


        lcd.print(Ausgabetext.substring(0, 16));

        lcd.once('printed', function () {
            lcd.setCursor(0, 1); // col 0, row 1
            lcd.print(lcdSecondRow.substring(0, 16)); // print date
        });
    }, 1000);
});

function logInStudent(name, coffeeContingent) {

    coffeeMachine.student_logged_in = true;
    logged_in_student.first_name = name;
    logged_in_student.contingent = coffeeContingent;

    setLcdFirstRowStudentInfo();

    setTimeout(function () {
        lcdFirstRowDefault = lcdStudentInfoRow;
        lcdFirstRow = lcdFirstRowDefault;
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

    lcdFirstRow = "Ausgeloggt";

    intern_led.writeSync(0);
    button_led.writeSync(0);

    setTimeout(function () {
        lcdFirstRowDefault = "SmartCoffee";
        lcdFirstRow = lcdFirstRowDefault;
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

app.get('/login/:username/:kontingent', function (req, res) {
    //  res.send('An!');
    var username = req.params.username;
    var kontingent = req.params.kontingent;
    logInStudent(username, kontingent ); //Math.round(Math.random()*20)
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
var rpi433    = require('rpi-433'),
    rfSniffer = rpi433.sniffer(17, 500), //Sniff on PIN 17 with a 500ms debounce delay
    rfSend    = rpi433.sendCode;

// Receive
rfSniffer.on('codes', function (code) {
    console.log('Code received: '+code);
});

// Send
/*
 rfSend(5393, 0, function(error, stdout) {   //Send 1234
 if(!error) console.log(stdout); //Should display 1234
 });
 */

button.watch(function(err, value){
    if (err) { throw err; }
    else{ get_coffee(); }
});




//Zeigt an, ob gerade ein Kaffee rausgelassen wird
var coffee_output_in_use = false;



//Funktion welche die Ausgabe des Kaffees regelt
function get_coffee(){

    //Es wird gerade Kaffee rausgelassen
    if(coffee_output_in_use==true){
        console.log("Bitte Warten - Kaffee wird bereits ausgegeben!");
    }

    //Kaffeemaschine ist leer
    else if(coffeeMachine.available_coffees <= 0){
        console.log("Kaffetopf ist leer - bitte wieder auff�llen!");
        lcdFirstRow = "Kaffee leer!         ";
        lcdSecondRow = "Mach neuen Kaffee!";
    }

    //Student ist nicht eingeloggt
    else if(coffeeMachine.student_logged_in==false){
        console.log("Kein Student eingeloggt! - Bitte einloggen");
        lcdFirstRow = "Bitte Einloggen!";
        setTimeout(function() {
            lcdFirstRow = lcdFirstRowDefault;
        }, 2000);
    }

    //Student ist eingeloggt, aber kein Kaffee kontingent mehr
    else if(logged_in_student.contingent<=0){
        console.log("Student hat kein Kaffeekontingent mehr und sollte sich jetzt schleunigst welches auff�llen, will er nicht einen schmerzvollen Erm�dungstod sterben");
        lcdFirstRow = "Kontingent leer!";
        setTimeout(function() {
            lcdFirstRow = lcdFirstRowDefault;
        }, 2000);
    }

    //Student ist eingeloggt und hat noch Kaffeekontingent
    else{
        //Weitere Kaffeeausgabeversuche w�hrend der Ausgabe blockieren
        coffee_output_in_use=true;
        //Kaffeeausgabe starten
        output_water.writeSync(1);
        console.log("Kaffee marsch !!");
        lcdFirstRow = "Kaffee !!!!";
        //Button LED ausmachen um zu singnalisieren, dass man sich gerade keinen Kaffee bestellen kann
        button_led.writeSync(0);

        setTimeout(function() {
            output_water.writeSync(0);
            console.log("Kaffee stopp !!");
            lcdFirstRow = "Kaffee fertig!";

            coffeeMachine.available_coffees--;
            logged_in_student.contingent--;

            //Wenn der Student noch Kontingent hat soll der Button leuchten
            if(logged_in_student.contingent<=0 || coffeeMachine.available_coffees<=0){button_led.writeSync(0);}


            // -----------------------------------------------------------
            // -----------------------------------------------------------
            // ToDo:Hier Http Request der dies auch in Backend anpasst ---
            // -----------------------------------------------------------
            // -----------------------------------------------------------

            setTimeout(function() {
                //lcdStudentInfoRow wieder auf  Basisinfodaten des Studenten zur�cksetzen "Name  (KaffeekontingentAnz)""
                setLcdFirstRowStudentInfo();
                lcdFirstRowDefault = lcdStudentInfoRow;
                lcdFirstRow = lcdFirstRowDefault;

                //Kaffeeausgabe wieder auf false setzte. Ab jetzt kann wieder Kaffee geortert weden
                coffee_output_in_use = false;
                console.log("Now you can get moooooore Coffee");

                //Wenn noch Kaffee da ist der Student noch Kontingent hat soll der Button leuchten
                if(logged_in_student.contingent>0 && coffeeMachine.available_coffees>0){button_led.writeSync(1);}

            }, 3000);

        }, 1500);
    } // END Else ::::: Student ist eingeloggt und hat noch Kaffeekontingent
}

app.get('/', function (req, res) {
    res.send('Hallo Liebhaber Koffeeinhaltiger Hei�getr�nke! Willkommen bei Smart Coffee!');
});

app.get('/light/on', function (req, res) {
    res.send('An!');
    intern_led.writeSync(1);
});

app.get('/button_led/on', function (req, res) {
    res.send('button_led on!');
    button_led.writeSync(1);
});

app.get('/button_led/off', function (req, res) {
    res.send('button_led on!');
    button_led.writeSync(0);
});

app.get('/light/short', function (req, res) {
    res.send('Licht 1sec an!');
    intern_led.writeSync(1);
    console.log("Licht 1 an");

    setTimeout(function () {
        intern_led.writeSync(0);
        console.log("Licht 1 aus");
    }, 1000);

});

app.get('/light/off', function (req, res) {
    res.send('Aus!');
    intern_led.writeSync(0);
});

app.get('/output_water/on', function (req, res) {
    res.send('2 An!');
    output_water.writeSync(1);
});

app.get('/output_water/off', function (req, res) {
    res.send('A2 us!');
    output_water.writeSync(0);
});

app.get('/get_coffee', function (req, res) {
    //Kaffee ausgeben
    get_coffee();
});

app.get('/power/on', function (req, res) {
    // Send
    rfSend(5393, 0, function (error, stdout) {   //Send 5393
        if (!error) {
            console.log(stdout); //Should display 5393
            res.send('Funksteckdose ueber 433hz eingeschaltet!');
        }
        else {
            res.send('Fehler!')
        }
    });
});

app.get('/power/off', function (req, res) {
    // Send
    rfSend(5396, 0, function (error, stdout) {   //Send 5393
        if (!error) {
            console.log(stdout); //Should display 5393
            res.send('Funksteckdose ueber 433hz ausgeschaltet!');
        }
        else {
            res.send('Fehler!')
        }
    });
});


app.get('/login/:username/:kontingent', function (req, res) {
    //  res.send('An!');
    var username = req.params.username;
    var kontingent = req.params.kontingent;
    logInStudent(username, kontingent); //Math.round(Math.random()*20)
});


app.get('/update_coffee_aount_in_pot/:coffee_number', function (req, res) {
    var coffee_number = req.params.coffee_number;
    //  res.send('An!');
    coffeeMachine.available_coffees = coffee_number;

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
