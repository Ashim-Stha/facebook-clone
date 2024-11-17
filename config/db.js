const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });
    console.log("Database connection established");
  } catch (e) {
    console.error("error connection to database", e.message);
    process.exit(1);
  }
};

module.exports = connectDb;
