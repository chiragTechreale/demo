const express = require("express");
const router = express.Router();
const waiterController = require("../../controllers/waiter/waiterAuthController"); // Import waiterController
const validationMiddleware = require("../../middleware/validateMiddleware");
const AuthGuard = require("../../middleware/authGuard");

// Waiter Login
router.post(
  "/login",
  validationMiddleware.validate(validationMiddleware.schema.Login),
  waiterController.login // Calls login function from waiterController
);

// Waiter Forgot Password
router.post(
  "/forgot-password",
  validationMiddleware.validate(validationMiddleware.schema.ForgotPassword),
  waiterController.forgotPassword // Calls forgotPassword function from waiterController
);

// Get Waiter Profile
router.get("/me", AuthGuard.verifyAccessToken, waiterController.me);

// Waiter Reset Password
router.post(
  "/reset-password",
  AuthGuard.verifyAccessToken,
  validationMiddleware.validate(validationMiddleware.schema.ResetPassword),
  waiterController.resetPassword // Calls resetPassword function from waiterController
);

// Waiter Verify OTP
router.post(
  "/verify-otp",
  AuthGuard.verifyAccessToken,
  validationMiddleware.validate(validationMiddleware.schema.VerifyOtp),
  waiterController.verifyOtp // Calls verifyOtp function from waiterController
);

// Waiter Resend OTP
router.post(
  "/resend-otp",
  validationMiddleware.validate(validationMiddleware.schema.ResendOtp),
  waiterController.resendOtp // Calls resendOtp function from waiterController
);

module.exports = router;
