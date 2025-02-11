const express = require("express");
const waiterController = require("../../controllers/admin/waiterController");
const validationMiddleware = require("../../middleware/validateMiddleware"); // Import validation middleware
const authMiddleware = require("../../middleware/authGuard"); // Import authentication middleware

const router = express.Router();

router.post(
  "/",
  authMiddleware.verifyAccessToken,
  validationMiddleware.validate(validationMiddleware.schema.WaiterCreate),
  waiterController.createWaiter
);

// Get all Waiters
router.get(
  "/",
  authMiddleware.verifyAccessToken, // Add authorization middleware
  waiterController.getAllWaiters
);

// Get a Waiter by ID
router.get(
  "/:id",
  authMiddleware.verifyAccessToken, // Add authorization middleware
  waiterController.getWaiterById
);

// Update Waiter with validation
router.put(
  "/:id",
  authMiddleware.verifyAccessToken, // Add authorization middleware
  validationMiddleware.validate(validationMiddleware.schema.WaiterCreate), // Add validation middleware
  waiterController.updateWaiter
);

// Delete Waiter
router.delete(
  "/:id",
  authMiddleware.verifyAccessToken, // Add authorization middleware
  waiterController.deleteWaiter
);

module.exports = router;
