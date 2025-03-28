const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    contactNumber: { type: String, required: true },
    additionalNotes: { type: String }
}, { timestamps: true });

// Prevent model overwrite error
const Donar = mongoose.models.Donar || mongoose.model('Donar', DonationSchema);

module.exports = Donar;
