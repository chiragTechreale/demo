const { Op } = require("sequelize");
const menuItemSchema = require("../../models/menuItem");
const {
  sendErrorResponse,
  sendSuccessResponse,
  throwError,
} = require("../../libs/utils"); // Import the utility functions
const constants = require("../../libs/constant");

const createMenuItem = async (req, res) => {
  try {
    const menuItemData = req.body;
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    menuItemData.imageUrl = JSON.stringify(imagePaths);
    menuItemData.superAdminId = req.userId;

    const existingItem = await menuItemSchema.findOne({
      where: {
        name: menuItemData.name,
        category: menuItemData.category,
      },
    });

    if (existingItem) {
      return res.status(409).json(
        sendErrorResponse({
          message: `Menu item with name '${menuItemData.name}' and category '${menuItemData.category}' already exists.`,
        })
      );
    }

    const newMenuItem = await menuItemSchema.create(menuItemData);

    if (!newMenuItem.imageUrl || newMenuItem.imageUrl.length === 0) {
      return res.status(500).json(
        sendErrorResponse({
          message:
            "Menu item created, but images were not saved in the database.",
        })
      );
    }

    return res.status(201).json(
      sendSuccessResponse({
        menuItemId: newMenuItem.id,
        imagePaths,
        message: constants.MENU.CREATE_SUCCESS,
      })
    );
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || "An unknown error occurred";
    return res.status(500).json(
      sendErrorResponse({
        message: errorMessage,
      })
    );
  }
};

const getAllMenuItems = async (req, res) => {
  const { category, isAvailable, minPrice, maxPrice, search } = req.query;
  const filterCondition = {};

  // Apply filters based on query parameters
  if (category) {
    filterCondition.category = category;
  }

  if (isAvailable !== undefined) {
    filterCondition.isAvailable = isAvailable === "true"; // Convert to boolean (true/false)
  }

  if (minPrice || maxPrice) {
    filterCondition.price = {
      [Op.between]: [
        parseFloat(minPrice) || 0, // Default to 0 if minPrice is not provided
        parseFloat(maxPrice) || Infinity, // Default to Infinity if maxPrice is not provided
      ],
    };
  }

  if (search) {
    filterCondition.name = {
      [Op.like]: `%${search}%`, // Search menu items based on name
    };
  }

  try {
    const menuItems = await menuItemSchema.findAll({
      where: filterCondition,
    });

    if (menuItems.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No menu items found with the given filters.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: menuItems,
      message: "Menu items fetched successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching menu items.",
    });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(
        sendErrorResponse({
          message: "Menu item ID is required.",
        })
      );
    }

    const menuItem = await menuItemSchema.findByPk(id);

    if (!menuItem) {
      return res.status(404).json(
        sendErrorResponse({
          message: constants.MENU.FETCH_ERROR,
        })
      );
    }

    return res.status(200).json(
      sendSuccessResponse({
        data: menuItem,
        message: constants.MENU.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || "An unknown error occurred";
    return res.status(500).json(
      sendErrorResponse({
        message: errorMessage,
      })
    );
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateMenuItemBody = req.body;

    if (!id) {
      return res.status(400).json(
        sendErrorResponse({
          message: "Menu item ID is required.",
        })
      );
    }

    const menuItem = await menuItemSchema.findByPk(id);

    if (!menuItem) {
      return res.status(404).json(
        sendErrorResponse({
          message: constants.MENU.FETCH_ERROR,
        })
      );
    }

    await menuItem.update(updateMenuItemBody);

    return res.status(200).json(
      sendSuccessResponse({
        data: menuItem,
        message: constants.MENU.UPDATE_SUCCESS,
      })
    );
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || "An unknown error occurred";
    return res.status(500).json(
      sendErrorResponse({
        message: errorMessage,
      })
    );
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(
        sendErrorResponse({
          message: "Menu item ID is required.",
        })
      );
    }

    const menuItem = await menuItemSchema.findByPk(id);

    if (!menuItem) {
      return res.status(404).json(
        sendErrorResponse({
          message: constants.MENU.FETCH_ERROR,
        })
      );
    }

    await menuItem.destroy();

    return res.status(200).json(
      sendSuccessResponse({
        message: constants.MENU.DELETE_SUCCESS,
      })
    );
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || "An unknown error occurred";
    return res.status(500).json(
      sendErrorResponse({
        message: errorMessage,
      })
    );
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
