const mongoose = require('mongoose');
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sdt: { type: String, required: true },
  GPLX: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);