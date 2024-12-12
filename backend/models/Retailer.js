const mongoose = require('mongoose');
const retailerSchema = new mongoose.Schema({
  type: { type: String, enum: ['Siêu thị', 'Cửa hàng tiện lợi', 'Tạp hóa', 'Khách vãng lai'], required: true },
  fullname: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Retailer', retailerSchema);