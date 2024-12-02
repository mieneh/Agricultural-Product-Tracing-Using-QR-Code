const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    fullname: { type: String },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Producer', 'Transport', 'Distributor', 'Consumer'], required: true },

    contactEmail: { type: String },
    contactPhone: { type: String },

    farmName: { type: String },
    farmLocation: { type: String },

    companyName: { type: String },
    location: { type: String },

    registrationNumber: { type: String },
    image: { type: String, default: null }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);