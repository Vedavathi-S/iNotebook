const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/inotebook';

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.log("Unable to connect with MongoDB", err);
  }
};

module.exports = connectToMongo;
