var lcdscreen = require('lcd');
var lcd = new lcdscreen({
    rs: 12,
    e: 21,
    data: [5, 6, 4, 18],
    cols: 16,
    rows: 2
});

module.exports = Display;


var Display = function() {
//Todo set default screen message

};

var emptyRow = "                ";
var lcdFirstRowDefault = "SmartCoffee";
var lcdFirstRow = lcdFirstRowDefault;
var lcdStudentInfoRow = "";
var lcdSecondRow = "2. Reihe";

var coffeeMachine = {};
coffeeMachine.student_logged_in = true;
coffeeMachine.temperature = 57;
coffeeMachine.available_coffees = 200;
coffeeMachine.coffee_finish_timestamp = Date.now();

var logged_in_student = {};
logged_in_student.first_name = "Hello";
logged_in_student.contingent = 100;

function setLcdFirstRowStudentInfo () {
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






