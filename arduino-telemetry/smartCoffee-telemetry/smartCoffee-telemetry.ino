#include "DHT.h"
#include <ArduinoJson.h>

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

float temperatureToSend;
float humidityToSend;


void setup() {
  Serial.begin(9600);
  Serial.println("Telemetry Broker is Running");
  dht.begin();
}

void loop() {
  // Read data every 2 seconds
  delay(2000);

  //init json tree
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["temperature"] = temperatureToSend;
  root["humidity"] = humidityToSend;

  //read sensor data
  float humidityCurrent = dht.readHumidity();
  float temperatureCurrent = dht.readTemperature();

  if (isnan(humidityCurrent) || isnan(temperatureCurrent)) {
    Serial.println("Failed to Read from!");
    return;
  }

  //check if the data has changed and prepare json to send
  if (temperatureCurrent != temperatureToSend || humidityCurrent != humidityToSend) {
    temperatureToSend = temperatureCurrent;
    humidityToSend = humidityCurrent;
    root["temperature"] = temperatureToSend;
    root["humidity"] = humidityToSend;
    root.printTo(Serial);
  }
}
