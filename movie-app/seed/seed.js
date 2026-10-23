require('dotenv').config();
const mongoose = require('mongoose');
const Title = require('../models/Title');
const titles = require('../data/titles');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
    await Title.deleteMany({});
    await Title.insertMany(titles);
    console.log(`✓ Seeded ${titles.length} titles`);
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
