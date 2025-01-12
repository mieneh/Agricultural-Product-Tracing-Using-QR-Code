const mongoose = require('mongoose');
const connectionSchema = new mongoose.Schema({
    producerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    transporterID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    message: { type: String, required: true, },
    typeProducer: { type: String, enum: ['Sent', 'Received'] },
    typeTransporter: { type: String, enum: ['Sent', 'Received'] },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Connection', connectionSchema);