// routes/reports.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");

module.exports = function(io) {
  const router = express.Router();

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "..", "uploads", "issues");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // Helper: call ML microservice to get embedding & classification
  async function getEmbeddingAndClassify(filePath) {
    try {
      const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:6000/embed";
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));
      const headers = form.getHeaders ? form.getHeaders() : { "Content-Type": "multipart/form-data" };
      const resp = await axios.post(mlUrl, form, { headers });
      return resp.data; // { embedding: [...], label: "pothole", dept: "Roads", confidence: 0.9 }
    } catch (err) {
      console.warn("ML service error:", err.message || err);
      return null;
    }
  }

  // Post a report
  router.post("/", authMiddleware, upload.fields([{ name: "image", maxCount: 1 }, { name: "audio", maxCount: 1 }]), async (req, res) => {
    try {
      const user = req.user;
      const files = req.files || {};
      const imageFile = files.image?.[0];
      const audioFile = files.audio?.[0];
      const { description, location } = req.body;

      let originalText = description || "";
      let englishText = originalText;
      const coordsInput = location?.split?.(",")?.map(Number) || null; // expecting "lat,lng"
      let geoPoint = null;
      if (coordsInput && coordsInput.length === 2) {
        const [lat, lng] = coordsInput;
        geoPoint = { type: "Point", coordinates: [lng, lat] };
      }

      // If image present, call ML service to get embedding and label
      let embedding = null, assignedDept = null, mlLabel = null;
      if (imageFile) {
        const mlResult = await getEmbeddingAndClassify(imageFile.path);
        if (mlResult) {
          embedding = mlResult.embedding || null;
          assignedDept = mlResult.dept || mlResult.label || null;
          mlLabel = mlResult.label || null;
        }
      }

      // GEO duplicate check: find any report within 20 meters
      if (geoPoint) {
        const nearby = await Report.findOne({
          location: {
            $nearSphere: {
              $geometry: geoPoint,
              $maxDistance: 20 // meters
            }
          }
        });

        if (nearby) {
          // optionally further compare images using embeddings
          let isDuplicate = true;
          if (nearby.embedding && embedding) {
            // compute cosine similarity
            const dot = embedding.reduce((s, v, i) => s + v * (nearby.embedding[i] || 0), 0);
            const normA = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0));
            const normB = Math.sqrt(nearby.embedding.reduce((s, v) => s + v * v, 0));
            const cos = dot / (normA * normB + 1e-10);
            if (cos < 0.80) isDuplicate = false; // threshold
          }
          if (isDuplicate) {
            // return duplicate info
            return res.status(409).json({ success: false, duplicate: true, msg: "An issue was already reported nearby.", existingReportId: nearby._id });
          }
        }
      }

      // Save report
      const report = new Report({
        user: user._id,
        imagePath: imageFile ? `/uploads/issues/${path.basename(imageFile.path)}` : null,
        audioPath: audioFile ? `/uploads/issues/${path.basename(audioFile.path)}` : null,
        originalDescription: originalText,
        originalLanguage: "auto",
        englishDescription: englishText,
        location: geoPoint,
        assignedDept,
        embedding
      });

      await report.save();

      // Broadcast via socket.io
      const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      const payload = {
        id: report._id,
        imageUrl: report.imagePath ? `${base}${report.imagePath}` : null,
        audioUrl: report.audioPath ? `${base}${report.audioPath}` : null,
        originalDescription: report.originalDescription,
        englishDescription: report.englishDescription,
        location: report.location,
        status: report.status,
        assignedDept: report.assignedDept,
        timestamp: report.timestamp
      };
      io.emit("new_report", payload);

      res.json({ success: true, msg: "Report saved", report: payload });
    } catch (err) {
      console.error("Report error:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  // Endpoint: get all reports (optionally filter by proximity or department)
  router.get("/", authMiddleware, async (req, res) => {
    try {
      const { lat, lng, dept } = req.query;
      let q = {};
      if (dept) q.assignedDept = dept;
      if (lat && lng) {
        q.location = {
          $nearSphere: {
            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            $maxDistance: 50000 // 50km default; adjust as needed
          }
        };
      }
      const reports = await Report.find(q).populate("user", "name email").sort({ createdAt: -1 }).limit(500);
      res.json({ success: true, reports });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  // Endpoint: update status (govt)
  router.post("/:id/status", authMiddleware, upload.single("solvedImage"), async (req, res) => {
    try {
      const user = req.user;
      if (user.role !== "authority") return res.status(403).json({ msg: "Forbidden" });

      const { id } = req.params;
      const { status } = req.body; // "In Progress" or "Solved"
      const solvedImage = req.file;
      const report = await Report.findById(id);
      if (!report) return res.status(404).json({ msg: "Report not found" });

      if (status) report.status = status;
      if (solvedImage) {
        report.solvedImagePath = `/uploads/issues/${path.basename(solvedImage.path)}`;
      }
      await report.save();

      // emit update
      const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      io.emit("update_report", {
        id: report._id,
        status: report.status,
        solvedImageUrl: report.solvedImagePath ? `${base}${report.solvedImagePath}` : null,
      });

      res.json({ success: true, report });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  return router;
};
