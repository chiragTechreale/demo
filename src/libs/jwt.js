const jwt = require("jsonwebtoken");
const config = require("../config/jwtconfig"); // Import JWT config
const SuperAdmin = require("../models/admin");
const Waiter = require("../models/waiter");

// Function to create a token
function createToken(payload) {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, config.secret, config.signOptions);
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
}

// Function to verify the token
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return reject({ message: "Invalid or expired token." });
      }

      try {
        const userId = decoded.id;
        let user;

        if (decoded.role === "superadmin") {
          user = await SuperAdmin.findByPk(userId);
        } else if (decoded.role === "waiter") {
          user = await Waiter.findByPk(userId);
        } else {
          return reject({ message: "Invalid user role." });
        }

        if (!user) {
          return reject({ message: "User not found." });
        }

        resolve({
          id: user.id,
          role: user.role,
        });
      } catch (error) {
        reject({ message: "Internal server error.", error: error.message });
      }
    });
  });
}

// Middleware to verify token in request and attach user data
function verifyTokenMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Authentication token is required." });
  }

  const tokenValue = token.split(" ")[1]; // Extract token from 'Bearer token'

  verifyToken(tokenValue)
    .then((user) => {
      req.user = user; // Attach user data to the request object
      next();
    })
    .catch((error) => {
      return res.status(401).json({ message: error.message });
    });
}

// Middleware to restrict access based on role
function restrictToRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "You are not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
}

module.exports = {
  createToken,
  verifyToken,
  verifyTokenMiddleware,
  restrictToRole,
};
