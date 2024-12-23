const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
  distributorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  harvestID: { type: mongoose.Schema.Types.ObjectId, ref: 'Harvest', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending', required: true },
  message: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);