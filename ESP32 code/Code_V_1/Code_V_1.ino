//-----------------------------------------------------------------------------
// RFID Pin Configuration (ESP32 + MFRC522)
// SDA  - 21
// SCK  - 18
// MOSI - 23
// MISO - 19
// RST  - 5
//-----------------------------------------------------------------------------
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Firebase_ESP_Client.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include <time.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#include "secrets.h"

/******************** HARDWARE PINS ********************/
#define RFID_SS_PIN   21
#define RFID_RST_PIN  5
#define RELAY_PIN     12
#define MANUAL_BTN    13
#define LED_YELLOW    2
#define LED_R         15
#define LED_G         4
#define LED_B         22
 
/******************** OBJECTS ********************/
Preferences prefs;
MFRC522 rfid(RFID_SS_PIN, RFID_RST_PIN);
WiFiClientSecure client;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastFetch = 0;
unsigned long lastWifiCheck = 0;
bool autoLock = false;

/******************** CARD STRUCT ********************/
struct Card {
  String uid;
  String owner;
};
std::vector<Card> storedCards;

/******************** FUNCTION DECLARATIONS ********************/
void connectWiFi();
void checkWiFi();
void fetchCards();
void loadCardsFromNVS();
void parseCards(String json);
void readRFID();
void unlockDoor(String owner, String uid);
void unknownCard(String uid);
void checkManualSwitch();
void sendDiscordLog(String owner, String uid, String door);
void sendDiscordAutoLock();
void logToFirebase(String owner, String uid, bool status);
bool timeToFetch();

/******************** NEW: Reset LEDs ********************/
void resetLEDs() {   // *** UPDATED ***
  digitalWrite(LED_R, LOW);
  digitalWrite(LED_G, LOW);
  digitalWrite(LED_B, LOW);
}

/******************** SETUP ********************/
void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(MANUAL_BTN, INPUT_PULLUP);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);

  resetLEDs();
  digitalWrite(RELAY_PIN, LOW);

  // REMOVE early yellow LED ON
  // digitalWrite(LED_YELLOW, HIGH);  // *** REMOVED ***

  connectWiFi();

  // NTP Time
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  struct tm timeinfo;
  if (getLocalTime(&timeinfo))
    Serial.println("NTP Time synced successfully.");
  else
    Serial.println("Failed to obtain NTP time.");

  // Firebase Setup
  config.api_key = FIREBASE_API_KEY;
  config.database_url = FIREBASE_URL;
  auth.user.email = "";   // Anonymous sign-in
  auth.user.password = "";
  
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("\n[BOOT] Fetching latest RFID cards from Firebase...");
  fetchCards();

  Serial.println("[BOOT] Loading cards from NVS...");
  loadCardsFromNVS();

  Serial.println("------ Stored Cards in NVS ------");
  for (auto &c : storedCards)
    Serial.printf("UID: %s | Owner: %s\n", c.uid.c_str(), c.owner.c_str());
  Serial.println("---------------------------------");

  Serial.println("System Ready...\n");

  // TURN ON YELLOW LED only after system is ready
  digitalWrite(LED_YELLOW, HIGH);     // *** UPDATED ***
}

/******************** LOOP ********************/
void loop() {
  if (millis() - lastWifiCheck > 30000) checkWiFi();
  if (timeToFetch()) fetchCards();
  readRFID();
  checkManualSwitch();
}

/******************** WIFI HANDLING ********************/
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected.");
  client.setInsecure();
}

void checkWiFi() {
  lastWifiCheck = millis();
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    connectWiFi();
  }
}

/******************** TIME & FETCH ********************/
bool timeToFetch() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return false;
  int hour = timeinfo.tm_hour;
  if (hour == 1 && millis() - lastFetch > 3600000) return true;
  return false;
}

void fetchCards() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot fetch cards — WiFi not connected!");
    return;
  }

  Serial.println("[Firebase] Fetching cards...");
  HTTPClient http;
  http.begin(String(FIREBASE_URL) + "/cards.json");
  int code = http.GET();
  
  if (code == 200) {
    String payload = http.getString();
    prefs.begin("cards", false);
    prefs.putString("data", payload);
    prefs.end();

    Serial.println("[Firebase] Cards fetched and saved to NVS!");
    Serial.println("[Firebase] Raw JSON:");
    Serial.println(payload);

    parseCards(payload);
    lastFetch = millis();
  } else {
    Serial.printf("[Firebase] Fetch failed! Code: %d\n", code);
  }

  http.end();
}

/******************** CARD STORAGE ********************/
void loadCardsFromNVS() {
  prefs.begin("cards", true);
  String data = prefs.getString("data", "{}");
  prefs.end();
  parseCards(data);
}

void parseCards(String json) {
  storedCards.clear();
  DynamicJsonDocument doc(4096);
  DeserializationError err = deserializeJson(doc, json);
  if (err) {
    Serial.println("Error parsing card JSON!");
    return;
  }
  for (JsonPair kv : doc.as<JsonObject>()) {
    Card c;
    c.uid = kv.key().c_str();
    c.owner = kv.value().as<String>();
    storedCards.push_back(c);
  }
  Serial.printf("Loaded %d cards.\n", storedCards.size());
}

/******************** RFID READING ********************/
void readRFID() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  // RESET LEDS when new card is detected  *** UPDATED ***
  resetLEDs();

  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++)
    uid += String(rfid.uid.uidByte[i], HEX);
  uid.toUpperCase();

  String owner = "";
  for (auto &c : storedCards)
    if (c.uid.equalsIgnoreCase(uid))
      owner = c.owner;

  if (owner != "") unlockDoor(owner, uid);
  else unknownCard(uid);

  rfid.PICC_HaltA();
}

/******************** DOOR CONTROL ********************/
void unlockDoor(String owner, String uid) {
  Serial.printf("Access granted to %s [%s]\n", owner.c_str(), uid.c_str());

  resetLEDs();
  digitalWrite(LED_G, HIGH);   

  digitalWrite(RELAY_PIN, HIGH);
  delay(5000);
  digitalWrite(RELAY_PIN, LOW);

  sendDiscordLog(owner, uid, "Unlocked");
  logToFirebase(owner, uid, true);
}

void unknownCard(String uid) {
  Serial.printf("Access denied for unknown UID: %s\n", uid.c_str());

  resetLEDs();
  digitalWrite(LED_R, HIGH);     

  sendDiscordLog("", uid, "Denied");
  logToFirebase("", uid, false);
}

/******************** MANUAL BUTTON HANDLING ********************/
void checkManualSwitch() {
  if (digitalRead(MANUAL_BTN) == LOW) {
    unlockDoor("Manual Switch", "N/A");
    autoLock = true;
    sendDiscordAutoLock();
    logToFirebase("Manual Switch", "N/A", true);
  }
}

/******************** DISCORD WEBHOOK ********************/
void sendDiscordAutoLock() {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(client, DISCORD_WEBHOOK);
  http.addHeader("Content-Type", "application/json");
  String json = "{\"content\":null,\"embeds\":[{\"title\":\":butterfly: Info! Inovus Smart Door :butterfly:\",\"description\":\"Hey, did you know!\\nOur **Smart Door** just triggered an auto-lock.\\n\\n> Door Status : **Locked**\\n> Agent : **Manual Button**\\n.\",\"color\":5614830,\"footer\":{\"text\":\"Note : Please ignore if legit.\"}}]}";
  int code = http.POST(json);
  Serial.println(code == 204 ? "Discord AutoLock sent" : "Webhook error");
  http.end();
}

void sendDiscordLog(String owner, String uid, String door) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(client, DISCORD_WEBHOOK);
  http.addHeader("Content-Type", "application/json");

  String json;
  if (owner != "") {
    json = "{\"content\":null,\"embeds\":[{\"title\":\":white_check_mark: Log! Smart Door :white_check_mark:\",\"description\":\"Authorized Access!\\n\\n> Door : **";
    json += door; json += "**\\n> UID : **"; json += uid; json += "**\\n> Owner : **"; json += owner;
    json += "**.\",\"color\":7844437}]}";
  } else {
    json = "{\"content\":null,\"embeds\":[{\"title\":\":warning: Alert! Smart Door :warning:\",\"description\":\"Unauthorized Attempt!\\n\\n> UID : **";
    json += uid; json += "**\\n> Owner : **Unknown**.\",\"color\":10381369}]}";
  }

  int code = http.POST(json);
  Serial.println(code == 204 ? "Discord log sent" : "Discord log failed");
  http.end();
}

/******************** FIREBASE LOGGING ********************/
void logToFirebase(String owner, String uid, bool status) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Skipping Firebase log - offline");
    return;
  }

  time_t now;
  time(&now);
  String timestamp = String((unsigned long)now);

  FirebaseJson json;
  json.set("owner", owner);
  json.set("tag", uid);
  json.set("status", status);
  json.set("time", now);

  String path = "/logs/" + timestamp;
  if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
    Serial.println("Firebase log saved successfully!");
  } else {
    Serial.println("Firebase log failed: " + fbdo.errorReason());
  }
}
