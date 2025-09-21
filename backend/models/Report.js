// models/Report.js
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imagePath: { type: String },
  solvedImagePath: { type: String },
  originalDescription: { type: String },
  originalLanguage: { type: String },
  englishDescription: { type: String },
  location: { // GeoJSON Point
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  timestamp: { type: Date, default: Date.now },
  audioPath: { type: String },
  warning: { type: String },
  status: { type: String, enum: ["Reported","In Progress","Solved"], default: "Reported" },
  assignedDept: { type: String }, // classification result -> dept
  embedding: { type: [Number] } // saved embedding vector for image similarity
}, { timestamps: true });

ReportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Report", ReportSchema);
