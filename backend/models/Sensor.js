const mongoose = require('mongoose');
const sensorSchema = new mongoose.Schema({
  batchID:  { type: String },
  temperature: { type: Number},
  humidity: { type: Number},
  light: { type: Number},
  latitude: { type: Number},
  longitude: { type: Number},
}, { timestamps: true });

module.exports = mongoose.model('Sensor', sensorSchema);