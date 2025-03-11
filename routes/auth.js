const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { Sequelize, DataTypes } = require("sequelize");

const router = express.Router();
const sequelize = require("../database"); // Import DB connection

// ✅ Define User Model
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [["admin", "user"]] } },
}, 
{ 
  tableName: "users",  // ✅ Ensure lowercase table name
  timestamps: true,     // ✅ Enable timestamps
  underscored: true,    // ✅ Use `created_at` and `updated_at`
});

// ✅ Sync database (Ensures "users" table exists)
sequelize.sync()
  .then(() => console.log("✅ Users table synced with correct timestamps"))
  .catch(err => console.error("❌ Database sync error:", err));

const SECRET_KEY = "your_secret_key"; // Change this to a secure key in production

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

    try {
      // ✅ Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ msg: "User already exists" });

      // ✅ Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Store user in the database
      const newUser = await User.create({
        email,
        password: hashedPassword,
        role,
      });

      res.json({ msg: "✅ User registered successfully!", user: { email: newUser.email, role: newUser.role } });

    } catch (err) {
      console.error("❌ Error registering user:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// ✅ Login Route (NEW)
router.post(
  "/login",
  [check("email", "Enter a valid email").isEmail(), check("password", "Password required").exists()],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // ✅ Fetch user from database
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(400).json({ msg: "❌ Invalid credentials" });

      // ✅ Compare hashed passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "❌ Invalid credentials" });

      // ✅ Generate JWT token
      const token = jwt.sign({ email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

      res.json({ msg: "✅ Login successful", token, role: user.role });

    } catch (err) {
      console.error("❌ Login Error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;

