const express = require("express");
const menuController = require("../../controllers/admin/menuController");
const validationMiddleware = require("../../middleware/validateMiddleware");
const { upload } = require("../../config/multerConfig");
const authGuard = require("../../middleware/authGuard");

const router = express.Router();
const { restrictAccess } = authGuard;

router.post(
  "/",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  upload,
  validationMiddleware.validate(validationMiddleware.schema.MenuCreate),
  menuController.createMenuItem
);

router.get(
  "/",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin", "waiter"]),
  menuController.getAllMenuItems
);

router.get(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  menuController.getMenuItemById
);

router.put(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  validationMiddleware.validate(validationMiddleware.schema.MenuUpdate),
  menuController.updateMenuItem
);

router.delete(
  "/:id",
  authGuard.verifyAccessToken,
  restrictAccess(["superadmin"]),
  menuController.deleteMenuItem
);

module.exports = router;
