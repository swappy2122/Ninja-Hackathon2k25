const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');




// Create a new donation
router.post('/', donationController.createDonation);

// Get all donations (with optional filtering)
router.get('/', donationController.getDonations);

// Get donation statistics
router.get('/stats', donationController.getDonationStats);

// Get donations for the current donor
router.get('/my-donations', donationController.getDonorDonations);

// Update donation status
router.patch('/:id/status', donationController.updateDonationStatus);

// Delete a donation
router.delete('/:id', donationController.deleteDonation);

module.exports = router;