const User = require('../models/User'); 

const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Kết nối MongoDB thành công!");

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminUser = new User({
        fullname: "Farm Track",
        email: adminEmail,
        password: adminPassword,
        role: "Admin"
      });
      await adminUser.save();
    } else {
      console.log(`Hãy đăng nhập tài khoản admin bằng ${adminEmail}.`);
    }
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err);
  }
}

module.exports = connectToDatabase;