const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Unauthorized - No Token" });

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized - Invalid Token" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden - Admins only" });
  next();
};

module.exports = { authenticateUser, authorizeAdmin };
