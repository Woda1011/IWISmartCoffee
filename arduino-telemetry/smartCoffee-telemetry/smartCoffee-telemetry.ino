#include "DHT.h"
#include <ArduinoJson.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
float temperatureToSend;
float coffeeFillLevelToSend;


void setup() {
  Serial.begin(9600);
  Serial.println("Telemetry Broker is Running");
  dht.begin();
}

void loop() {
  // Read data every 2 seconds
  delay(2000);

  // Step 1: Reserve memory space
  StaticJsonBuffer<200> jsonBuffer;
  
  // Step 2: Build object tree in memory
  JsonObject& root = jsonBuffer.createObject();
  root["temperature"] = temperatureToSend;
  root["coffeeFillLevel"] = coffeeFillLevelToSend;
  
  float humidityCurrent = dht.readHumidity();
  float temperatureCurrent = dht.readTemperature();
  
  // Check if any reads failed and exit early (to try again).
  if (isnan(humidityCurrent) || isnan(temperatureCurrent)) {
    Serial.println("Failed to Read from!");
    return;
  }

    temperatureToSend = temperatureCurrent;
    root["temperature"] = temperatureToSend;
    root.printTo(Serial);
  
}
