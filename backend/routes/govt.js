// routes/govt.js
const express = require("express");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function(io) {
  const router = express.Router();

  // Get issues assigned to authority's jurisdiction / department
  router.get("/issues", authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      if (user.role !== "authority") return res.status(403).json({ msg: "Forbidden" });

      // Basic filter by jurisdiction OR assignedDept
      const { jurisdiction } = user;
      const query = {};
      if (jurisdiction) query["assignedDept"] = { $regex: jurisdiction, $options: "i" }; // or refine logic
      const issues = await Report.find(query).sort({ createdAt: -1 }).limit(100);
      res.json({ success: true, issues });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  return router;
};
