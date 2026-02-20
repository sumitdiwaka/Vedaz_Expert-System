const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

exports.createBooking = async (req, res) => {
    const { expertId, userEmail, date, time } = req.body;

    try {
        // 1. Check if the slot is already marked as booked in the Expert model
        const expert = await Expert.findOne({
            _id: expertId,
            "slots.date": date,
            "slots.time": time,
            "slots.isBooked": false
        });

        if (!expert) {
            return res.status(400).json({ message: "Slot already booked or does not exist." });
        }

        // 2. Create the booking (Unique Index in Booking model handles the race condition)
        const newBooking = new Booking(req.body);
        await newBooking.save();

        // 3. Update the Expert's slot status to isBooked: true
        await Expert.updateOne(
            { _id: expertId, "slots.date": date, "slots.time": time },
            { $set: { "slots.$.isBooked": true } }
        );

        // 4. EMIT REAL-TIME UPDATE via Socket.io
        const io = req.app.get('socketio');
        io.emit('slotBooked', { expertId, date, time });

        res.status(201).json({ message: "Booking successful", booking: newBooking });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "This slot was just taken by another user." });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const bookings = await Booking.find({ userEmail: email })
            .populate('expertId') // This replaces the ID with the Expert document
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};