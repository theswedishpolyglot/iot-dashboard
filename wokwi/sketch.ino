#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <time.h>

#define DHT_PIN 15
#define DHT_TYPE DHT22
#define LED_PIN 2

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqttServer = "broker.emqx.io";
const int mqttPort = 1883;

const char* sensorTopic = "lnu/iot/wm222et/sensor";
const char* commandTopic = "lnu/iot/wm222et/command/led";

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
DHT dht(DHT_PIN, DHT_TYPE);

unsigned long lastPublish = 0;
const unsigned long publishIntervalMs = 2000;

void connectWifi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected");
  configTime(0, 0, "pool.ntp.org");
}

void handleMqttMessage(char* topic, byte* payload, unsigned int length) {
  String message;

  for (unsigned int index = 0; index < length; index++) {
    message += (char) payload[index];
  }

  Serial.print("Command received: ");
  Serial.println(message);

  if (message.indexOf("\"state\":true") >= 0) {
    digitalWrite(LED_PIN, HIGH);
  }

  if (message.indexOf("\"state\":false") >= 0) {
    digitalWrite(LED_PIN, LOW);
  }
}

void connectMqtt() {
  while (!mqttClient.connected()) {
    String clientId = "wokwi-wm222et-";
    clientId += String(random(0xffff), HEX);

    Serial.print("Connecting to MQTT...");

    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("connected");
      mqttClient.subscribe(commandTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.println(mqttClient.state());
      delay(2000);
    }
  }
}

void publishSensorReading() {
  float temperature = dht.readTemperature();

  if (isnan(temperature)) {
    Serial.println("Failed to read DHT sensor");
    return;
  }

  String payload = "{";
  payload += "\"value\":";
  payload += String(temperature, 1);
  payload += ",\"timestamp\":";
  payload += String(time(nullptr));
  payload += "}";

  mqttClient.publish(sensorTopic, payload.c_str());

  Serial.print("Published: ");
  Serial.println(payload);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  dht.begin();
  connectWifi();
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(handleMqttMessage);
}

void loop() {
  if (!mqttClient.connected()) {
    connectMqtt();
  }

  mqttClient.loop();

  if (millis() - lastPublish >= publishIntervalMs) {
    lastPublish = millis();
    publishSensorReading();
  }
}
