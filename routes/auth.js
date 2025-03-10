const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const users = []; // Temporary array for testing (Replace with DB later)

const SECRET_KEY = "your_secret_key"; // Change in production

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database"); // Import DB connection

// ✅ Define User Model (Ensures Table Exists)
const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
});

// ✅ Sync Database (Auto-Creates Table)
sequelize.sync()
  .then(() => console.log("✅ Users table synced"))
  .catch(err => console.error("❌ Database sync error:", err));


// ✅ Register User Route
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

module.exports = router;
