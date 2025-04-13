import mongoose from 'mongoose';
import Donation from '../models/Donation';
import Fund from '../models/Fund';
import { config } from '../config';

interface MonthlyBreakdown {
  [key: string]: number;
}

async function createSampleDonations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB Atlas');

    // Get active fund
    const activeFund = await Fund.findOne({ status: 'active' });
    if (!activeFund) {
      console.error('No active fund found. Please create an active fund first.');
      return;
    }

    // Sample donations for the last 6 months
    const sampleDonations = [];
    const purposes = ['Education', 'Healthcare', 'Food', 'Shelter', 'Emergency Relief'];
    const now = new Date();

    // Create donations for each month (last 6 months)
    for (let i = 0; i < 6; i++) {
      const month = new Date(now);
      month.setMonth(month.getMonth() - i);
      
      // Create 5-10 donations for each month
      const numDonations = Math.floor(Math.random() * 6) + 5;
      
      for (let j = 0; j < numDonations; j++) {
        const amount = Math.floor(Math.random() * 900) + 100; // Random amount between 100-1000
        const donation = {
          amount,
          transactionId: `TRANS${i}${j}${Date.now()}${Math.floor(Math.random() * 1000)}`,
          purpose: purposes[Math.floor(Math.random() * purposes.length)],
          status: 'completed',
          paymentMethod: 'upi', // lowercase as per enum
          donor: {
            name: `Donor ${i}-${j}`,
            email: `donor${i}${j}@example.com`,
            phone: `98765${i}${j}${Math.floor(Math.random() * 1000)}`
          },
          anonymous: false,
          message: `Sample donation message ${i}-${j}`,
          createdAt: month,
          updatedAt: month
        };
        sampleDonations.push(donation);
      }
    }

    // Clear existing donations
    await Donation.deleteMany({});
    console.log('Cleared existing donations');

    // Insert sample donations
    const createdDonations = await Donation.insertMany(sampleDonations);
    console.log(`Created ${createdDonations.length} sample donations`);

    // Update fund's currentAmount
    const totalDonations = sampleDonations.reduce((sum, donation) => sum + donation.amount, 0);
    await Fund.findByIdAndUpdate(activeFund._id, {
      $set: { currentAmount: totalDonations }
    });
    console.log(`Updated fund's current amount to: ${totalDonations}`);

    // Log some statistics
    const stats = {
      totalDonations: createdDonations.length,
      totalAmount: totalDonations,
      averageDonation: Math.floor(totalDonations / createdDonations.length),
      monthlyBreakdown: {} as MonthlyBreakdown
    };

    // Calculate monthly breakdown
    createdDonations.forEach(donation => {
      const monthYear = `${donation.createdAt.getMonth() + 1}/${donation.createdAt.getFullYear()}`;
      if (!stats.monthlyBreakdown[monthYear]) {
        stats.monthlyBreakdown[monthYear] = 0;
      }
      stats.monthlyBreakdown[monthYear] += donation.amount;
    });

    console.log('Donation Statistics:', stats);

  } catch (error) {
    console.error('Error creating sample donations:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

createSampleDonations(); 