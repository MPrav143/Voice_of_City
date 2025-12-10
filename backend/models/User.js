// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "authority"], default: "user" },
  phone: { type: String },
  address: { type: String },
  jurisdiction: { 
    type: String, 
    enum: ["Roads", "Sanitation", "Waterworks", "General"], 
    default: "General",
    required: function() { return this.role === "authority"; }
  }
 // for authority users
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
