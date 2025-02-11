const express = require("express");
const tableController = require("../../controllers/admin/tableController");
const validationMiddleware = require("../../middleware/validateMiddleware");
const authGuard = require("../../middleware/authGuard");
const { upload } = require("../../config/multerConfig");

const router = express.Router();
const { restrictAccess } = authGuard;

router.post(
  "/",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  validationMiddleware.validate(validationMiddleware.schema.TableCreate),
  tableController.createHotelTable
);

router.get(
  "/",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  tableController.getAllHotelTables
);

router.get(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  tableController.getHotelTableById
);

router.put(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  validationMiddleware.validate(validationMiddleware.schema.TableUpdate),
  tableController.updateHotelTable
);

router.delete(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  tableController.deleteHotelTable
);

module.exports = router;
