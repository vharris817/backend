const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { User } = require("../models"); // ✅ Import User model

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // ✅ Use ENV variable

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

      res.json({ msg: "✅ User registered successfully!", user: { id: newUser.id, email: newUser.email, role: newUser.role } });

    } catch (err) {
      console.error("❌ Error registering user:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ Ensure both `token` and `user` are returned
    res.json({
      msg: "✅ Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;


