const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { Sequelize, DataTypes } = require("sequelize");

const router = express.Router();
const sequelize = require("../database"); // Import DB connection

// ✅ Define User Model (Ensures users are stored in DB)
const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [["admin", "user"]] } },
}, { tableName: "users" }); // ✅ Ensure correct table name

// ✅ Sync database (Ensures "users" table exists)
sequelize.sync()
  .then(() => console.log("✅ Users table synced"))
  .catch(err => console.error("❌ Database sync error:", err));

// ✅ Register User Route (Fixed to Store in DB)
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

      res.json({ msg: "✅ User registered successfully!", user: newUser });

    } catch (err) {
      console.error("❌ Error registering user:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
