# raspberry-broker
Der PI empfängt die Sensordaten des Arduino und sendet diese an das Backend!

* Im Root ``npm install``
* Zum Starten ``npm start``

## Sicherheit erhöhen
### Neuen User anlegen
Der Standarduser und das Standardpasswort sollten unbedingt geändert werden.
* Benutzer hinzufügen ``sudo useradd -m smartcoffee -G sudo``
* Passwort setzen ``sudo passwd smartcoffeepassword``
Mit diesen Befehlen wird ein neuer User mit den gleichen Berechtigungen wie der
Standarduser angelegt.
### Standarduser löschen
Mit dem neu angelegten User einloggen und folgende Befehle ausführen:
* ``sudo visudo`` Fürs sichere Entfernen des alten Users
* ``sudo deluser pi`` Alten PI-User löschen
* ``sudo deluser -remove-home pi`` Altes Homeverzeichnis von PI löschen



## Useful Linux Commands
* PI ordentlich runterfahren ``sudo shutdown -h 0``


## PN532 Board installieren
Für das Board werden verschiedene Bibliotheken benötigt.
* libnfc
* libfreefare
* mifare-classic node module (Probleme der Bibliotheken ist die relativ magere API, die für gesicherte Karten wie die CampusCard nicht funktionieren. Wir benötigen lediglich die ID)
* node-nfc package schafft auch keine Abhilfe
* Lösung ist aufrufen eines ChildProcess mit libnfc Befehl

https://www.npmjs.com/package/pn532

Die Kommunikation vom PN532 Modul in Richtung des PI erfolgt mittels SPI (alternativen wären UART oder I2C). Daher ist es wichtig, dass das Board für SPI konfiguriert wird.

* Sketch einfügen

eine ausführliche Anleitung gibt es unter:
* URL einfügen



### Installation von libnfc
http://www.schnatterente.net/technik/nfc-raspberry-pi-pn532-breakout-board
https://learn.adafruit.com/adafruit-nfc-rfid-on-raspberry-pi/building-libnfc
### Installation von libfreefare
* Repo ziehen ``git clone https://github.com/nfc-tools/libfreefare.git``
* Ins Repo navigieren ``cd libfreefare``
* ``autoreconf -vis`` ausführen
* ``./configure``  ausführen
* ``sudo make``
* ``sudo make install``

### Installation von mifare-classic
Das Modul ist bereits in der ``package.json`` enthalten und wird somit automatisch installiert.

### Installation von wiringPI
https://learn.sparkfun.com/tutorials/raspberry-gpio/c-wiringpi-setup


### Script für Autostart des Node-Scripts einrichten ###
* Editor öffnen ``sudo nano /etc/rc.local``
* Folgende Zeile vor ``exit 0`` einfügen
``node /home/pi/Development/IWISmartCoffee/raspberry-broker/server.js``

#### Node Prozess für Entwicklungszwecke beenden
* für Entwicklungszwecke ist es hilfreich den Prozess selbst zu starten, damit die Konsole lesbar wird. Dazu den Prozess abschießen und selbst neustarten

* ``pgrep node`` PID rausfinden
* ``sudo kill {PID}`` zum Beenden des node Prozess
* ``sudo npm start`` Manueller start des Node-Scripts
