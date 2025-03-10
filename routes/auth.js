const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const users = []; // Temporary in-memory user storage (Replace with DB later)

const SECRET_KEY = "your_secret_key"; // 🔒 Change this in production!

// ✅ Register User (Only for initial setup, remove later)
router.post(
  "/register",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("role", "Role must be either 'admin' or 'user'").isIn(["admin", "user"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, role } = req.body;
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword, role });

    res.json({ msg: "User registered successfully", users });
  }
);

// ✅ Login Route
router.post(
  "/login",
  [check("email", "Enter a valid email").isEmail(), check("password", "Password required").exists()],
  async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, role: user.role });
  }
);

// ✅ Protect Routes Middleware
const authMiddleware = (roles = []) => (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Access denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!roles.includes(decoded.role)) return res.status(403).json({ msg: "Unauthorized access" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ✅ Protected Example Route
router.get("/admin-only", authMiddleware(["admin"]), (req, res) => {
  res.json({ msg: "Welcome, Admin!" });
});

module.exports = router;
