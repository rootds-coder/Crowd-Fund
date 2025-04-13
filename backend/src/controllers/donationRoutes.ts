import express from 'express';
import {
  createDonation,
  updateDonationStatus,
  getDonations
} from '../controllers/donationController';
import { verifyJWT } from '../middleware/auth';

const router = express.Router();

// Public route for creating donations
router.post('/donations', createDonation);

// Admin routes (require authentication)
router.use(verifyJWT);
router.get('/admin/donations', getDonations);
router.put('/admin/donations/:id/status', updateDonationStatus);

export default router;