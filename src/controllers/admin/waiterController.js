const waiterSchema = require("../../models/waiter");
const bcrypt = require("bcryptjs");
const constants = require("../../libs/constant");
const Utils = require("../../libs/utils"); // Import the Utils module

// Create Waiter
const createWaiter = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res
        .status(Utils.statusCode.BAD_REQUEST)
        .json(
          Utils.sendErrorResponse({ message: constants.WAITER.CREATE_ERROR })
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newWaiter = await waiterSchema.create({
      name,
      email,
      password: hashedPassword,
      superAdminId: req.userId,
      phoneNumber,
    });
    return res
      .status(Utils.statusCode.CREATED)
      .json(
        Utils.sendSuccessResponse(
          { newWaiter },
          constants.WAITER.CREATE_SUCCESS
        )
      );
  } catch (error) {
    console.error("Error adding waiter:", error.message);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(Utils.statusCode.CONFLICT)
        .json(
          Utils.sendErrorResponse({
            message: "Waiter with this email already exists.",
          })
        );
    }
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .json(Utils.sendErrorResponse({ message: error.message }));
  }
};

// Get All Waiters
const getAllWaiters = async (req, res) => {
  try {
    const waiters = await waiterSchema.findAll();
    if (!waiters.length) {
      return res
        .status(Utils.statusCode.NOT_FOUND)
        .json(
          Utils.sendErrorResponse({ message: constants.WAITER.FETCH_ERROR })
        );
    }
    return res
      .status(Utils.statusCode.OK)
      .json(
        Utils.sendSuccessResponse({ waiters }, constants.WAITER.FETCH_SUCCESS)
      );
  } catch (error) {
    console.error("Error retrieving waiters:", error.message);
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .json(Utils.sendErrorResponse({ message: error.message }));
  }
};

// Get Waiter By ID
const getWaiterById = async (req, res) => {
  const { id } = req.params;
  try {
    const waiter = await waiterSchema.findByPk(id);
    if (!waiter) {
      return res
        .status(Utils.statusCode.NOT_FOUND)
        .json(
          Utils.sendErrorResponse({ message: constants.WAITER.FETCH_ERROR })
        );
    }
    return res
      .status(Utils.statusCode.OK)
      .json(
        Utils.sendSuccessResponse({ waiter }, constants.WAITER.FETCH_SUCCESS)
      );
  } catch (error) {
    console.error("Error retrieving waiter:", error.message);
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .json(Utils.sendErrorResponse({ message: error.message }));
  }
};

// Update Waiter
const updateWaiter = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, superAdminId, phoneNumber } = req.body;
  try {
    const waiter = await waiterSchema.findByPk(id);
    if (!waiter) {
      return res
        .status(Utils.statusCode.NOT_FOUND)
        .json(
          Utils.sendErrorResponse({ message: constants.WAITER.FETCH_ERROR })
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    waiter.name = name || waiter.name;
    waiter.email = email || waiter.email;
    waiter.password = hashedPassword || waiter.password;
    waiter.superAdminId = superAdminId || waiter.superAdminId;
    waiter.phoneNumber = phoneNumber || waiter.phoneNumber;

    await waiter.save();
    return res
      .status(Utils.statusCode.OK)
      .json(
        Utils.sendSuccessResponse({ waiter }, constants.WAITER.UPDATE_SUCCESS)
      );
  } catch (error) {
    console.error("Error updating waiter:", error.message);
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .json(
        Utils.sendErrorResponse({ message: constants.WAITER.UPDATE_ERROR })
      );
  }
};

// Delete Waiter
const deleteWaiter = async (req, res) => {
  const { id } = req.params;
  try {
    const waiter = await waiterSchema.findByPk(id);
    if (!waiter) {
      return res
        .status(Utils.statusCode.NOT_FOUND)
        .json(
          Utils.sendErrorResponse({ message: constants.WAITER.FETCH_ERROR })
        );
    }
    await waiter.destroy();
    return res
      .status(Utils.statusCode.OK)
      .json(Utils.sendSuccessResponse(null, constants.WAITER.DELETE_SUCCESS));
  } catch (error) {
    console.error("Error deleting waiter:", error.message);
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .json(
        Utils.sendErrorResponse({ message: constants.WAITER.DELETE_ERROR })
      );
  }
};

module.exports = {
  createWaiter,
  getAllWaiters,
  getWaiterById,
  updateWaiter,
  deleteWaiter,
};
