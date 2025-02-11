const jwt = require("jsonwebtoken");
const config = require("../config/jwtconfig"); // Import JWT config
const SuperAdmin = require("../models/admin");
const Waiter = require("../models/waiter");
const Utils = require("../libs/utils");
const { ErrorMsg } = require("../libs/constant");

/**
 * Verifies the token and returns user details.
 * @param {string} token - The JWT token.
 * @returns {object} The decoded user data.
 */
async function verifyToken(token) {
  try {
    // Verify token with JWT secret
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return reject({ message: "Invalid or expired token." }); // Handle invalid token error
        }
        resolve(decoded);
      });
    });

    const userId = decoded.id;
    let user;

    // Check user role and fetch corresponding user
    if (decoded.role === "superadmin") {
      user = await SuperAdmin.findByPk(userId);
    } else if (decoded.role === "waiter") {
      user = await Waiter.findByPk(userId);
    } else {
      throw { message: "Invalid user role." };
    }

    if (!user) {
      throw { message: "User not found." }; // Handle user not found error
    }

    return {
      id: user.id,
      role: user.role,
    };
  } catch (error) {
    throw error; // Rethrow error for handling in verifyAccessToken
  }
}

/**
 * Middleware to verify the access token.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
async function verifyAccessToken(req, res, next) {
  try {
    const authToken = req.headers["authorization"];
    if (!authToken) {
      return res.status(Utils.statusCode.UNAUTHORIZED).send(
        Utils.sendErrorResponse({ message: "Token Required" }) // Handle missing token error
      );
    }

    // Extract the bearer token from 'Bearer <token>'
    const bearer = authToken.split("Bearer ");
    if (bearer.length !== 2) {
      return res.status(Utils.statusCode.UNAUTHORIZED).send(
        Utils.sendErrorResponse(
          Utils.getErrorMsg("Token format is invalid.") // Handle invalid token format error
        )
      );
    }

    const bearerToken = bearer[1];
    const user = await verifyToken(bearerToken);

    req.user = user; // Attach user info to request
    req.userId = user.id; // Attach user ID to request
    req.token = bearerToken; // Attach token to request for reference

    next(); // Proceed to the next middleware or route handler
  } catch (e) {
    return res.status(Utils.statusCode.UNAUTHORIZED).send(
      Utils.sendErrorResponse(
        Utils.getErrorMsg(e.message || ErrorMsg.EXCEPTIONS.wentWrong) // General error message for token errors
      )
    );
  }
}

/**
 * Middleware to restrict access based on user role.
 * @param {Array<string>} allowedRoles - The list of allowed roles.
 * @returns {Function} The middleware function.
 */
function restrictAccess(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(Utils.statusCode.FORBIDDEN).send(
        Utils.sendErrorResponse(
          Utils.getErrorMsg(
            "You do not have permission to access this resource."
          ) // Handle access restriction
        )
      );
    }

    next(); // If user has permission, proceed to the next middleware or route handler
  };
}

module.exports = {
  verifyAccessToken,
  restrictAccess,
};
