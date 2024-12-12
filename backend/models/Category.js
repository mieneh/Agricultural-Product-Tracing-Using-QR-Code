const mongoose = require('mongoose'); 
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  expiry: { type: String },
  maxday: { type: Number },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);