const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema({
  vehicleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driverID: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  batchID: { type: mongoose.Schema.Types.ObjectId, ref: 'Harvest', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  estimatedArrival: { type: Date, required: true },
  status: { type: String, default: 'Pending' },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);