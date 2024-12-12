const mongoose = require('mongoose');
const regionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  address: { 
    province: { type: String, required: true },
    district: { type: String, required: true },
    commune: { type: String, required: true },
    street: { type: String, required: true },
  },
  area: { type: String },
  description: { type: String },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Region', regionSchema);