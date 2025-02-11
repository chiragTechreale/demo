const express = require("express");
const adminRoutes = require("./admin");
const waiterRoutes = require("./waiter");

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/waiter", waiterRoutes);

module.exports = router;
