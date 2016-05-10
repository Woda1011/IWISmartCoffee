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


/*
 *      ------ ONOFF - FUER KOMMUNIKATION MIT GPIOs ------
 */
var Gpio = require('onoff').Gpio,
    button_led = new Gpio(26, 'out'),
    intern_led = new Gpio(20, 'out'),
    output_water = new Gpio(23, 'out'),
    button = new Gpio(22, 'in', 'rising'); //geht noch nicht richtig

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
        LCD_Zeile_1_Text = "Kaffee leer!         ";
        LCD_Zeile_2_Text = "Mach neuen Kaffee!";
    }

    //Student ist nicht eingeloggt
    else if(coffeeMachine.student_logged_in==false){
        console.log("Kein Student eingeloggt! - Bitte einloggen");
        LCD_Zeile_1_Text = "Bitte Einloggen!";
        setTimeout(function() {
            LCD_Zeile_1_Text = LCD_Zeile_1_Text_Default;
        }, 2000);
    }

    //Student ist eingeloggt, aber kein Kaffee kontingent mehr
    else if(logged_in_student.contingent<=0){
        console.log("Student hat kein Kaffeekontingent mehr und sollte sich jetzt schleunigst welches auff�llen, will er nicht einen schmerzvollen Erm�dungstod sterben");
        LCD_Zeile_1_Text = "Kontingent leer!";
        setTimeout(function() {
            LCD_Zeile_1_Text = LCD_Zeile_1_Text_Default;
        }, 2000);
    }

    //Student ist eingeloggt und hat noch Kaffeekontingent
    else{
        //Weitere Kaffeeausgabeversuche w�hrend der Ausgabe blockieren
        coffee_output_in_use=true;
        //Kaffeeausgabe starten
        output_water.writeSync(1);
        console.log("Kaffee marsch !!");
        LCD_Zeile_1_Text = "Kaffee !!!!";
        //Button LED ausmachen um zu singnalisieren, dass man sich gerade keinen Kaffee bestellen kann
        button_led.writeSync(0);

        setTimeout(function() {
            output_water.writeSync(0);
            console.log("Kaffee stopp !!");
            LCD_Zeile_1_Text = "Kaffee fertig!";


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
                //LCD_Zeile_1_Text_Studentname_Kaffeekontingent wieder auf  Basisinfodaten des Studenten zur�cksetzen "Name  (KaffeekontingentAnz)""
                setLCD_Zeile_1_Text_Studentname_Kaffeekontingent();
                LCD_Zeile_1_Text_Default = LCD_Zeile_1_Text_Studentname_Kaffeekontingent;
                LCD_Zeile_1_Text = LCD_Zeile_1_Text_Default;

                //Kaffeeausgabe wieder auf false setzte. Ab jetzt kann wieder Kaffee geortert weden
                coffee_output_in_use = false;
                console.log("Now you can get moooooore Coffee");

                //Wenn noch Kaffee da ist der Student noch Kontingent hat soll der Button leuchten
                if(logged_in_student.contingent>0 && coffeeMachine.available_coffees>0){button_led.writeSync(1);}

            }, 3000);

        }, 1500);
    } // END Else ::::: Student ist eingeloggt und hat noch Kaffeekontingent
}

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
