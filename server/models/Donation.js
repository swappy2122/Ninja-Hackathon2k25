const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    contactNumber: { type: String, required: true },
    additionalNotes: { type: String }
}, { timestamps: true });




module.exports = mongoose.model('Donation', DonationSchema);