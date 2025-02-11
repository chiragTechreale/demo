const express = require("express");
const router = express.Router();
const AuthRoutes = require("./authRoutes");
const OrderRoutes = require("./orderRoutes");
const InvoiceRoutes = require("./invoiceRoutes");

router.use("/auth", AuthRoutes);
router.use("/invoice", InvoiceRoutes);
router.use("/order", OrderRoutes);
module.exports = router;
