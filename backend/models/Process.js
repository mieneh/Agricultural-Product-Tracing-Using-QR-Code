const mongoose = require('mongoose');
const processSchema = new mongoose.Schema({
  name: { type: String, required: true },
  steps: [
    {
      name: { type: String, required: true },
      content: { type: String, required: true },
    }
  ],
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Process', processSchema);