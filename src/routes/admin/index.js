const express = require("express");
const router = express.Router();
const AuthRoutes = require("./authRoutes");
const MenuRoutes = require("./menuRoutes");
const TableRoutes = require("./tableRoutes");
const WaiterRoutes = require("./waiterRoutes");
router.use("/auth", AuthRoutes);
router.use("/menu", MenuRoutes);
router.use("/table", TableRoutes);
router.use("/waiter", WaiterRoutes);
router.use("/menu", MenuRoutes);
module.exports = router;
