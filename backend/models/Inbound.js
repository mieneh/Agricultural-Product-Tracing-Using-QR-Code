const mongoose = require('mongoose');
const inboundSchema = new mongoose.Schema({
  batchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Harvest', required: true },
  entryDate: { type: Date, required: true },
  storageCondition: { type: String, required: true },
  quantity: { type: Number, required: true },
  remainingQuantity: { type: Number, required: true },
  status: { type: String, default: 'Pending'},
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Inbound', inboundSchema);