import mongoose from 'mongoose';
import { config } from '../config';
import Fund from '../models/Fund';

const createActiveFund = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Check if there's already an active fund
    const existingActiveFund = await Fund.findOne({ status: 'active' });
    
    if (existingActiveFund) {
      console.log('Active fund already exists:', existingActiveFund);
      await mongoose.disconnect();
      return;
    }

    // Create a new active fund
    const fund = await Fund.create({
      name: 'General Donation Fund',
      description: 'Support our ongoing charitable initiatives and help make a difference in people\'s lives.',
      targetAmount: 1000000, // 10 lakhs
      currentAmount: 0,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });

    console.log('Created new active fund:', fund);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating active fund:', error);
    process.exit(1);
  }
};

// Run the script
createActiveFund(); 