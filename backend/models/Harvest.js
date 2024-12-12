const mongoose = require('mongoose');
const harvestSchema = new mongoose.Schema({
  batch: { type: String, required: true },
  harvestDate: { type: Date, required: true },
  expirationDate: { type: Date },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
  process: { type: mongoose.Schema.Types.ObjectId, ref: 'Process', required: true },
  quantity: { type: Number, required: true },
  note: { type: String },
  qrCode: { type: String },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  distributorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transporterID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
}, { timestamps: true });

module.exports = mongoose.model('Harvest', harvestSchema);