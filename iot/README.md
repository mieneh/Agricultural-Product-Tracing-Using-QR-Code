# FarmTrack IoT — Hướng Dẫn Kết Nối Thiết Bị

## Giới thiệu

Dự án **FarmTrack IoT** dùng để **giám sát chuỗi vận chuyển nông sản** thông qua thiết bị ESP32.
Thiết bị này sẽ đọc dữ liệu **nhiệt độ, độ ẩm, ánh sáng, GPS**, và **đồng bộ thời gian thực (RTC)**, sau đó **gửi dữ liệu lên server Node.js**.

## Cài đặt thư viện cần thiết

Mở **Arduino IDE** → vào **Tools → Manage Libraries** và cài đặt các thư viện sau:

| Thư viện           | Tên trong Library Manager        |
| ------------------ | -------------------------------- |
| WiFi               | ESP32 built-in                   |
| DHT sensor library | `DHT sensor library` by Adafruit |
| TinyGPS++          | `TinyGPSPlus` by Mikal Hart      |
| RTClib             | `RTClib` by Adafruit             |
| WebServer          | ESP32 built-in                   |
| HTTPClient         | ESP32 built-in                   |
| Wire               | ESP32 built-in                   |

## Cấu hình file `config.h`

Vào file `config.h`, tạo cấu hình như sau:

```cpp
#ifndef CONFIG_H
#define CONFIG_H

// WiFi Config
#define WIFI_SSID "TenWiFi"
#define WIFI_PASSWORD "MatKhauWiFi"

// Server Config
#define SERVER_URL "http://DiaChiIP:PORT/api/sensor/data"

#endif
```

> Mở Terminal gõ lệnh `ip config` để lấy địa chỉ IP máy chủ Node.js của máy đang chạy. Sau đó, thay `DiaChiIP` bằng địa chỉ trên và đảm bảo ESP32 và server chạy cùng mạng WiFi nội bộ.

> Thay `PORT` bằng PORT chạy trong backend.

> Chú ý: Mở file .ino tìm các chỗ chứa `DiaChiIP:PORT` thay bằng địa chỉ trên và PORT trên.

---

## Chạy chương trình

1. Kết nối ESP32 qua cổng USB.
2. Mở file `.ino` trong Arduino IDE.
3. Chọn board:

   ```
   Tools → Board → ESP32 Arduino → ESP32 Dev Module
   ```
4. Chọn đúng cổng COM.
5. Nhấn **Upload (Ctrl+U)** để nạp code.
6. Mở **Serial Monitor (115200 baud)** để kiểm tra log:

   ```
   Connected to WiFi. IP: 192.168.1.xxx
   HTTP server started
   ```

---

## Truy cập giao diện web nội bộ (Dành cho tài xế)

Sau khi ESP32 chạy, mở trình duyệt và nhập địa chỉ IP hiển thị trên Serial Monitor:

```
http://192.168.1.xxx/
```

Trang web sẽ hiển thị giao diện:

* Nhập mã lô hàng (`batchID`)
* Nhấn **Bắt đầu** để gửi dữ liệu cảm biến định kỳ lên server.
* Xem thông tin tài xế, biển số xe, địa điểm, nhiệt độ, độ ẩm, ánh sáng, GPS theo thời gian thực.