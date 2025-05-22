const mongoose = require('mongoose');
const config = require('./config'); // Assuming dbUrl comes from here

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // Optional based on your mongoose version
    await mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Force stop the server if DB is not connected
  }
};

module.exports = connectDB;

