const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/admin/authController"); // Use AuthController
const validationMiddleware = require("../../middleware/validateMiddleware");
const AuthGuard = require("../../middleware/authGuard");

// Login route
router.post(
  "/login",
  validationMiddleware.validate(validationMiddleware.schema.Login),
  AuthController.login // Updated to AuthController
);

// Forgot password route
router.post(
  "/forgot-password",
  validationMiddleware.validate(validationMiddleware.schema.ForgotPassword),
  AuthController.forgotPassword // Updated to AuthController
);
router.get("/me", AuthGuard.verifyAccessToken, AuthController.me);
// Reset password route
router.post(
  "/reset-password",
  AuthGuard.verifyAccessToken, // Ensure this is added to verify user before resetting password
  validationMiddleware.validate(validationMiddleware.schema.ResetPassword),
  AuthController.resetPassword // Updated to AuthController
);

// Verify OTP route
router.post(
  "/verify-otp",
  AuthGuard.verifyAccessToken, // Ensure this is added to verify user before verifying OTP
  validationMiddleware.validate(validationMiddleware.schema.VerifyOtp),
  AuthController.verifyOtp // Updated to AuthController
);

// Resend OTP route
router.post(
  "/resend-otp",
  validationMiddleware.validate(validationMiddleware.schema.ResendOtp), // Validate email schema for resend OTP
  AuthController.resendOtp // This calls the resendOtp method in AuthController
);

module.exports = router;
