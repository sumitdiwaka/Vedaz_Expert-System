const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true },
    notes: String,
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Completed'], 
        default: 'Confirmed' 
    }
}, { timestamps: true });

// PREVENT DOUBLE BOOKING AT DATABASE LEVEL
bookingSchema.index({ expertId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);