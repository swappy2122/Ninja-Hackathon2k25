const Donation = require('../models/Donation');


// Create a new donation
exports.createDonation = async (req, res) => {
    try {
        const { 
            foodType, 
            quantity, 
            city, 
            expiryDate 
        } = req.body;

        // Use the authenticated user's ID from the token
        const donation = new Donation({
            donor: req.user.id,
            foodType,
            quantity,
            city,
            expiryDate: new Date(expiryDate)
        });

        await donation.save();

        res.status(201).json({
            message: 'Donation created successfully',
            donation
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating donation', 
            error: error.message 
        });
    }
};

// Get all donations with optional filtering
exports.getDonations = async (req, res) => {
    try {
        const { 
            city, 
            status, 
            page = 1, 
            limit = 10 
        } = req.query;

        // Build query object
        const query = {};
        if (city) query.city = new RegExp(city, 'i');
        if (status) query.status = status;

        // Populate donor details and apply pagination
        const donations = await Donation.find(query)
            .populate('donor', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Get total count for pagination
        const total = await Donation.countDocuments(query);

        res.json({
            donations,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching donations', 
            error: error.message 
        });
    }
};

// Get donation statistics
exports.getDonationStats = async (req, res) => {
    try {
        // Total donors (users who have made donations)
        const totalDonors = await Donation.aggregate([
            { $group: { _id: '$donor' } },
            { $countDocuments: {} }
        ]);

        // Total donations
        const totalDonations = await Donation.countDocuments();

        // Available donations
        const availableDonations = await Donation.countDocuments({ 
            status: 'available' 
        });

        // Donations by city
        const donationsByCity = await Donation.aggregate([
            { 
                $group: { 
                    _id: '$city', 
                    totalDonations: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' }
                } 
            },
            { $sort: { totalDonations: -1 } }
        ]);

        // Recent donations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentDonations = await Donation.find({
            createdAt: { $gte: sevenDaysAgo }
        }).populate('donor', 'name');

        res.json({
            totalDonors: totalDonors[0]?.count || 0,
            totalDonations,
            availableDonations,
            donationsByCity,
            recentDonations
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching donation statistics', 
            error: error.message 
        });
    }
};

// Update donation status
exports.updateDonationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['available', 'collected', 'expired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status' 
            });
        }

        const donation = await Donation.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ 
                message: 'Donation not found' 
            });
        }

        res.json({
            message: 'Donation status updated successfully',
            donation
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating donation status', 
            error: error.message 
        });
    }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the donation
        const donation = await Donation.findByIdAndDelete(id);

        if (!donation) {
            return res.status(404).json({ 
                message: 'Donation not found' 
            });
        }

        res.json({ 
            message: 'Donation deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting donation', 
            error: error.message 
        });
    }
};

// Get donations for a specific donor
exports.getDonorDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ 
            donor: req.user.id 
        }).sort({ createdAt: -1 });

        res.json(donations);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching donor donations', 
            error: error.message 
        });
    }
};