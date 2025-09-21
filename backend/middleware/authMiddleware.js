// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ msg: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) return res.status(401).json({ msg: "Invalid token user" });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token error" });
  }
};

module.exports = authMiddleware;
