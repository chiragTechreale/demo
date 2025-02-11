const express = require("express");
const invoiceController = require("../../controllers/waiter/invoiceController");
const validationMiddleware = require("../../middleware/validateMiddleware");
const authGuard = require("../../middleware/authGuard");
const router = express.Router();

router.get(
  "/pdf/:invoiceId",
  authGuard.verifyAccessToken,
  authGuard.restrictAccess(["superadmin", "waiter"]),
  invoiceController.generateInvoice
);

router.get(
  "/:invoiceId",
  authGuard.verifyAccessToken,
  authGuard.restrictAccess(["superadmin", "waiter"]),
  invoiceController.getInvoice
);

router.put(
  "/:invoiceId",
  authGuard.verifyAccessToken,
  authGuard.restrictAccess(["superadmin", "waiter"]),
  validationMiddleware.validate(validationMiddleware.schema.InvoiceCreate),
  invoiceController.updateInvoiceStatus
);

router.get(
  "/",
  authGuard.verifyAccessToken,
  authGuard.restrictAccess(["superadmin", "waiter"]),
  invoiceController.getAllInvoices
);

module.exports = router;
