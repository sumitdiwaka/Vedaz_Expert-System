const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    description: String,
    profileImage: String,
    // Available slots: { date: "2026-02-22", time: "10:00 AM", isBooked: false }
    slots: [{
        date: String,
        time: String,
        isBooked: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('Expert', expertSchema);