const mongoose = require('mongoose');
const outboundSchema = new mongoose.Schema({
  exitDate: { type: Date, required: true },
  entryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Inbound', required: true },
  quantity: { type: Number, required: true },
  note: { type: String },
  retailerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Outbound', outboundSchema);