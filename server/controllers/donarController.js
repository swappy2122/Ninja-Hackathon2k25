const Donar = require('../models/Donar'); // Import the model

// @desc    Create a new food donation
// @route   POST /api/donations/create
// @access  Public
exports.createDonation = async (req, res) => {
    try {
        const { foodName, quantity, expiryDate, pickupLocation, contactNumber, additionalNotes } = req.body;

        // Validate required fields
        if (!foodName || !quantity || !expiryDate || !pickupLocation || !contactNumber) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Create a new donation document
        const newDonation = new Donation({
            foodName,
            quantity,
            expiryDate,
            pickupLocation,
            contactNumber,
            additionalNotes
        });

        // Save to MongoDB
        await newDonation.save();
        res.status(201).json({ message: "Donation saved successfully.", donation: newDonation });

    } catch (error) {
        console.error("Error saving donation:", error);
        res.status(500).json({ message: "Server error. Unable to save donation." });
    }
};

// @desc    Get all available food donations
// @route   GET /api/donations/available
// @access  Public
exports.getAvailableDonations = async (req, res) => {
    try {
        const donations = await Donation.find({});
        res.status(200).json(donations);

    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ message: "Server error. Unable to fetch donations." });
    }
};
