#include "config.h"
#include <WiFi.h>
#include <DHT.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <Wire.h>
#include <RTClib.h>
#include <WebServer.h>
#include <HTTPClient.h>

// DHT Sensor setup (Temperature and Humidity)
#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;
HardwareSerial gpsSerial(2); // UART2: TX = 17, RX = 16
RTC_DS1307 rtc;

// Create WebServer instance
WebServer server(80);

// HTML content
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>F a r m T r a c k</title>
    <style>
       @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600&display=swap');
      * {
        font-family: 'Comfortaa', sans-serif;
      }
      body {
        background: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
      }
      header {
        background: linear-gradient(#88d32c, #56ab2f, #2ecc71);
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 18px;
      }
      main {
        max-width: 1500px;
        margin: 20px auto;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: darkgreen;
        font-size: 28px;
        text-align: center;
        margin-bottom: 20px;
      }
      .input-group {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      input[type="text"] {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        margin-right: 10px;
      }
      button {
        padding: 10px 15px;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      #startBtn {
        background: #28a745;
        color: white;
      }
      #stopBtn {
        background: #dc3545;
        color: white;
        display: none;
      }
      button:hover {
        opacity: 0.9;
      }
      #sensorData {
        margin-top: 20px;
        padding: 15px;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .sensor-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 1rem;
      }
      .sensor-item i {
        font-size: 1.5rem;
        margin-right: 10px;
        color: darkgreen; /* Màu mặc định */
      }
  
      /* Thêm màu cho các icon */
      .sensor-item i.temp-icon {
        color: red; /* Màu cho icon nhiệt độ */
      }
  
      .sensor-item i.humidity-icon {
        color: blue; /* Màu cho icon độ ẩm */
      }
  
      .sensor-item i.light-icon {
        color: yellow; /* Màu cho icon ánh sáng */
      }
  
      .sensor-item i.gps-icon {
        color: blueviolet; /* Màu cho icon GPS */
      }
  
      .sensor-item i.driver-icon {
        color: darkblue;
      }
  
      .sensor-item i.vehicle-icon {
        color: darkred;
      }
  
      .sensor-item i.start-location-icon, .sensor-item i.end-location-icon {
        color: #56ab2f; /* Màu xanh lá cho địa điểm */
      }
  
      .sensor-item i.quantity-icon {
        color: orange;
      }
  
      .sensor-item i.produce-icon {
        color: #f39c12; /* Màu vàng cho mặt hàng */
      }
  
    </style>
    <!-- Font Awesome CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
  </head>
  <body>
    <header>F a r m T r a c k</header>
    <main>
      <h1>T R A C K I N G</h1>
      <div class="input-group">
        <input type="text" id="batchID" placeholder="Nhập mã lô hàng">
        <button id="startBtn">Bắt đầu</button>
        <button id="stopBtn">Dừng lại</button>
      </div>
  
      <div id="sensorData" style="display:none;">
        <h2>Dữ liệu cảm biến</h2>
        <div class="sensor-item">
          <i class="fas fa-thermometer-half temp-icon"></i>
          <p id="temp">Nhiệt độ: --</p>
        </div>
        <div class="sensor-item">
          <i class="fas fa-tint humidity-icon"></i>
          <p id="humidity">Độ ẩm: --</p>
        </div>
        <div class="sensor-item">
          <i class="fas fa-lightbulb light-icon"></i>
          <p id="light">Ánh sáng: --</p>
        </div>
        <div class="sensor-item">
          <i class="fas fa-map-marker-alt gps-icon"></i>
          <p id="gps">GPS: --</p>
        </div>
      </div>
  
    <!-- Thông tin driver và biển số xe -->
    <div id="info" style="display: none;">
      <h2>Thông tin chuyến hàng</h2>
      <div class="sensor-item">
        <i class="fas fa-user driver-icon"></i>
        <p><strong>Tài xế:</strong> <span id="driverName"></span></p>
      </div>
      <div class="sensor-item">
        <i class="fas fa-car vehicle-icon"></i>
        <p><strong>Biển số xe:</strong> <span id="vehiclePlate"></span></p>
      </div>
      <div class="sensor-item">
        <i class="fas fa-map-marker-alt start-location-icon"></i>
        <p><strong>Đi từ:</strong> <span id="startLocation"></span></p>
      </div>
      <div class="sensor-item">
        <i class="fas fa-map-marker-alt end-location-icon"></i>
        <p><strong>Tới:</strong> <span id="endLocation"></span></p>
      </div>
      <div class="sensor-item">
        <i class="fas fa-box quantity-icon"></i>
        <p><strong>Số lượng:</strong> <span id="quantity"></span> kg</p>
      </div>
      <div class="sensor-item">
        <i class="fas fa-crop produce-icon"></i>
        <p><strong>Mặt hàng:</strong> <span id="produce"></span></p>
      </div>
    </div>  
  
    <div id="endMessage" style="display:none;">
      <h2>Kết thúc chuyến hàng</h2>
      <p id="finalData"></p>
    </div>
  
    </main>
  
  <script>
    let trackingInterval;
    let finalData = {};
  
    document.getElementById("startBtn").addEventListener("click", () => {
      const batchID = document.getElementById("batchID").value;
      if (batchID) {
        fetch("http://DiaChiIP:PORT/api/sensor/check-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchID: batchID })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === "Processing") {
            document.getElementById("sensorData").style.display = "block";
            document.getElementById("startBtn").style.display = "none";
            document.getElementById("stopBtn").style.display = "inline-block";
  
            // Hiển thị thông tin driver và biển số xe
            document.getElementById("driverName").textContent = data.driverID.name;
            document.getElementById("vehiclePlate").textContent = data.vehicleID.plateNumber;
            document.getElementById("startLocation").textContent = data.batchID.userID.farmLocation;
            document.getElementById("endLocation").textContent = data.batchID.distributorID.location;
            document.getElementById("quantity").textContent = data.batchID.quantity;
            document.getElementById("produce").textContent = data.batchID.product.name;
            document.getElementById("info").style.display = "block";
  
            trackingInterval = setInterval(() => {
              fetch(`/get-sensor-data?batchID=${batchID}`)
                .then(response => response.json())
                .then(sensorData => {
                  document.getElementById("temp").textContent = "Nhiệt độ: " + sensorData.temperature + " °C";
                  document.getElementById("humidity").textContent = "Độ ẩm: " + sensorData.humidity + " %";
                  document.getElementById("light").textContent = "Ánh sáng: " + sensorData.light + " lux";
                  document.getElementById("gps").textContent = "GPS: " + sensorData.gps;
  
                  finalData = sensorData;
                });
            }, 2000);
          } else {
            alert(data.message);
          }
        })
        .catch(err => console.log(err));
      } else {
        alert("Vui lòng nhập mã lô hàng.");
      }
    });
  
    document.getElementById("stopBtn").addEventListener("click", () => {
      clearInterval(trackingInterval);
      const batchID = document.getElementById("batchID").value;
      fetch("http://DiaChiIP:PORT/api/sensor/end-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchID: batchID })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        document.getElementById("sensorData").style.display = "none";
        document.getElementById("startBtn").style.display = "inline-block";
        document.getElementById("stopBtn").style.display = "none";
        document.getElementById("info").style.display = "none";
      })
      .catch(err => console.log(err));
    });
  </script>
  
  </body>
  </html>
  )rawliteral";
  
  // Handle root request
  void handleRoot() {
    server.send(200, "text/html", index_html);
  }
  
  // Thời gian lần gửi gần nhất
  unsigned long lastSendTime = 0;
  
  // Gửi dữ liệu cảm biến lên server
  void sendDataToServer(String batchID, float temp, float humidity, int light, double lat, double lng) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    
    DateTime now = rtc.now();
    unsigned long timestamp = now.unixtime();

    String jsonData = "{\"batchID\":\"" + batchID + "\",\"temperature\":" + String(temp) + ",\"humidity\":" + String(humidity) + ",\"light\":" + String(light) + ",\"latitude\":" + String(lat, 6) + ",\"longitude\":" + String(lng, 6) + ",\"timestamp\":" + String(timestamp) + "}";
    int httpResponseCode = http.POST(jsonData);
  
    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully." + jsonData);
    } else {
      Serial.println("Error sending data");
    }
    http.end();
  }
  
  // Xử lý yêu cầu dữ liệu cảm biến
  void handleSensorData() {
    String batchID = server.arg("batchID");
  
    // Đọc sensors
    float temp = dht.readTemperature();
    float humidity = dht.readHumidity();
    int light = analogRead(32);
    double lat = gps.location.isValid() ? gps.location.lat() : 0.0;
    double lng = gps.location.isValid() ? gps.location.lng() : 0.0;
    DateTime now = rtc.now();
    unsigned long timestamp = now.unixtime();

    // Kiểm tra giá trị cảm biến ánh sáng
    if (light < 0 || light > 4095) {
      light = 0;
    }
  
    // Gửi dữ liệu lên server mỗi phút
    unsigned long currentTime = millis();
    if (currentTime - lastSendTime >= 6000) {
      lastSendTime = currentTime;
      sendDataToServer(batchID, temp, humidity, light, lat, lng);
    }
  
    // Gửi phản hồi về trang web
    String jsonResponse = "{\"temperature\":" + String(temp) + ",\"humidity\":" + String(humidity) + ",\"light\":" + String(light) + ",\"gps\":\"" + String(lat, 6) + ", " + String(lng, 6) + "\"" + ",\"timestamp\":" + String(timestamp) + "}";
    server.send(200, "application/json", jsonResponse);
  }
  
  void setup() {
    Serial.begin(115200);
  
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("\nConnected to WiFi. IP: " + WiFi.localIP().toString());
  
    dht.begin();
    rtc.begin();
    gpsSerial.begin(9600, SERIAL_8N1, 16, 17);
  
    // Serve HTML page
    server.on("/", HTTP_GET, handleRoot);
  
    server.on("/get-sensor-data", HTTP_GET, handleSensorData);
  
    server.begin();
    Serial.println("HTTP server started");
  }
  
  void loop() {
    while (gpsSerial.available() > 0) {
      char c = gpsSerial.read();
      gps.encode(c);
    }
    server.handleClient();
}