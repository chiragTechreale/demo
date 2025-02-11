const express = require("express");
const orderController = require("../../controllers/waiter/orderController");
const validationMiddleware = require("../../middleware/validateMiddleware");
const authGuard = require("../../middleware/authGuard");
const { restrictAccess } = authGuard;
const router = express.Router();

router.post(
  "/",
  authGuard.verifyAccessToken,
  validationMiddleware.validate(validationMiddleware.schema.OrderCreate),
  orderController.placeOrder
);

router.get(
  "/",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  orderController.getAllOrders
);

router.get(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  orderController.getOrderById
);

router.put(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  validationMiddleware.validate(validationMiddleware.schema.OrderStatus),
  orderController.updateOrderStatus
);

router.get(
  "/table/:tableId",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  orderController.getOrdersByTableId
);

router.get(
  "/waiter/:waiterId",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  orderController.getOrdersByWaiterId
);

router.get(
  "/status/:status",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  orderController.getOrdersByStatus
);

module.exports = router;
