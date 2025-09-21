const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,  // Atlas requires TLS/SSL
      tls: true   // redundant but okay
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
