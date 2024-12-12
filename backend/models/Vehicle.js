const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  type: { type: String, required: true },
  plateNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  maintenanceStatus: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);