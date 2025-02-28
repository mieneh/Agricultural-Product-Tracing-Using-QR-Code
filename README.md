# Farm Track — Ứng Dụng Truy Vết Nông Sản Bằng Mã QR

## Giới thiệu

**Farm Track** là một hệ thống truy xuất nguồn gốc nông sản, kết hợp giữa:

* **Web App (React + Node + MongoDB)** để quản lý, giám sát chuỗi cung ứng.
* **Thiết bị IoT (ESP32 + DHT22 + GPS)** để theo dõi nhiệt độ, độ ẩm, ánh sáng và vị trí trong quá trình vận chuyển.
* **Mã QR** để định danh từng lô hàng và cho phép người dùng kiểm tra thông tin trực tiếp.

---

## Cài đặt và chạy chương trình

### Cài đặt môi trường (Yêu cầu)

* [Node.js](https://nodejs.org/) (phiên bản >= 18.0.0)
* [MongoDB](https://www.mongodb.com/try/download/community) hoặc [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* (Tùy chọn) Tài khoản [Cloudinary](https://cloudinary.com/) để lưu ảnh & QR code.

---

### Cấu hình Backend (Node.js)

1. Di chuyển đến thư mục `backend`:

   ```bash
   cd backend
   ```
2. Tạo file `.env` và cấu hình:

   ```env
   PORT=<Port chạy server>
   ADMIN_EMAIL=<Email đăng nhập admin>
   ADMIN_PASSWORD=<Mật khẩu admin>
   MONGO_URI=mongodb://localhost:27017/<Tên database>
   CLOUDINARY_NAME=<Tên tài khoản Cloudinary>
   CLOUDINARY_KEY=<API Key Cloudinary>
   CLOUDINARY_SECRET=<API Secret Cloudinary>
   BASE_URL=http://localhost:3001
   ```
3. Cài đặt thư viện:

   ```bash
   npm install
   ```
4. Chạy server:

   ```bash
   npm start
   ```

**Kết quả:** Backend chạy tại địa chỉ `http://localhost:<PORT>`

---

### Cấu hình Frontend (React.js)

1. Di chuyển đến thư mục `frontend`:

   ```bash
   cd frontend
   ```
2. Tạo file `.env` và cấu hình:

   ```env
   REACT_APP_API_URL=http://localhost:<PORT>/api
   ```
3. Cài đặt thư viện:

   ```bash
   npm install
   ```
4. Chạy ứng dụng:

   ```bash
   npm start
   ```

**Kết quả:** Frontend chạy tại địa chỉ `http://localhost:3001`

---

## Kết nối và cài đặt thiết bị IoT (ESP32)

***Đã hướng dẫn trong folder iot***
