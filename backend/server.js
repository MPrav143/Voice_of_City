require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// --- Routes ---
const authRoutes = require("./routes/auth");
const reportsRoutes = require("./routes/reports")(io); // ✅ pass io
const govtRoutes = require("./routes/govt")(io);       // ✅ pass io

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/govt", govtRoutes);

// --- ML Service Integration ---
const upload = multer({ dest: "uploads/" });

app.post("/api/reports/classify", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const mlRes = await axios.post("http://localhost:6000/embed", formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    return res.json(mlRes.data);
  } catch (err) {
    console.error("ML service error:", err.message);
    return res.status(500).json({ error: "ML service unavailable" });
  }
});

// --- MongoDB Connection ---
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/civicapp";
mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✓ MongoDB connected"))
  .catch((e) => console.error("MongoDB connection error:", e));

// --- Socket.io Events ---
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("disconnect", () =>
    console.log("⚡ Socket disconnected:", socket.id)
  );
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

// Export io if needed elsewhere
module.exports = { io };
