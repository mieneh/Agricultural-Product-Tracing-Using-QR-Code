const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, },
    read: { type: Boolean, default: false, },
    type: { type: String, enum: ['system', 'connection', 'request', 'order'],},
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);