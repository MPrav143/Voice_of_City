// routes/govt.js
const express = require("express");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function(io) {
  const router = express.Router();

  router.get("/issues", authMiddleware, async (req, res) => {
    try {
      const user = req.user;

      // Only authorities can access
      if (user.role !== "authority") {
        return res.status(403).json({ success: false, msg: "Forbidden" });
      }

      const { jurisdiction } = user;
      // let query = {};

      // // Filter by jurisdiction (case-insensitive)
      // if (jurisdiction) {
      //   query.assignedDept = { $regex: new RegExp(`^${jurisdiction}$`, "i") };
      // }

      // Fetch all matching issues, newest first

      const query = {}; // fetch all
      const issues = await Report.find(query).sort({ createdAt: -1 });

      res.json({ success: true, issues });
    } catch (err) {
      console.error("Govt /issues error:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  return router;
};
