// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

const authRoutes = require("./routes/auth");
const reportsRoutes = require("./routes/reports")(io); // inject io
const govtRoutes = require("./routes/govt")(io);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/govt", govtRoutes);

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/civicapp";
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("Mongo connected"))
  .catch((e)=> console.error(e));

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  socket.on("disconnect", ()=> console.log("socket disconnected:", socket.id));
});

// export io if needed elsewhere
module.exports = { io };
