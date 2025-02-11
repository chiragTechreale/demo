const hotelTableSchema = require("../../models/hotelTable");
const {
  sendSuccessResponse,
  sendErrorResponse,
  statusCode,
} = require("../../libs/utils");
const logger = require("../../libs/logger");
const constants = require("../../libs/constant");

const createHotelTable = async (req, res) => {
  try {
    const tableData = req.body;
    tableData.superAdminId = req.userId; // Get superAdminId from token
    console.log(tableData);
    const newHotelTable = await hotelTableSchema.create(tableData);

    return res.status(statusCode.CREATED).json(
      sendSuccessResponse({
        data: newHotelTable,
        message: constants.HOTETABLES.CREATE_SUCCESS,
      })
    );
  } catch (error) {
    logger.error(error.message);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(statusCode.CONFLICT)
        .json(sendErrorResponse({ message: error.message }));
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(statusCode.NOT_FOUND).json(
        sendErrorResponse({
          message: "SuperAdmin ID not found in the database.",
        })
      );
    }

    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: error.message }));
  }
};

const getAllHotelTables = async (req, res) => {
  try {
    const { reservationStatus, seats, is_occupied } = req.query;
    const superAdminId = req.userId; // Get superAdminId from token

    const filterOptions = { superAdminId };

    if (reservationStatus) filterOptions.reservationStatus = reservationStatus;
    if (seats) filterOptions.seats = seats;
    if (is_occupied !== undefined)
      filterOptions.is_occupied = is_occupied === "true";

    const hotelTables = await hotelTableSchema.findAll({
      where: filterOptions,
    });

    return res.status(statusCode.OK).json(
      sendSuccessResponse({
        data: hotelTables,
        message: constants.HOTETABLES.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    logger.error(error.message);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: error.message }));
  }
};

const getHotelTableById = async (req, res) => {
  const { id } = req.params;
  try {
    const hotelTable = await hotelTableSchema.findByPk(id);

    if (!hotelTable) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(sendErrorResponse({ message: constants.HOTETABLES.FETCH_ERROR }));
    }

    if (hotelTable.superAdminId !== req.userID) {
      return res.status(statusCode.FORBIDDEN).json(
        sendErrorResponse({
          message: "You do not have permission to access this table.",
        })
      );
    }

    return res.status(statusCode.OK).json(
      sendSuccessResponse({
        data: hotelTable,
        message: constants.HOTETABLES.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    logger.error(error.message);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: error.message }));
  }
};

const updateHotelTable = async (req, res) => {
  const { id } = req.params;
  const { tableNumber, seats, reservationStatus, is_occupied } = req.body;
  const superAdminId = req.userId;

  try {
    const hotelTable = await hotelTableSchema.findByPk(id);

    if (!hotelTable) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(
          sendErrorResponse({ message: constants.HOTETABLES.UPDATE_ERROR })
        );
    }

    if (hotelTable.superAdminId !== superAdminId) {
      return res.status(statusCode.FORBIDDEN).json(
        sendErrorResponse({
          message: "You do not have permission to update this table.",
        })
      );
    }

    if (tableNumber && tableNumber !== hotelTable.tableNumber) {
      const existingTable = await hotelTableSchema.findOne({
        where: { tableNumber },
      });
      if (existingTable) {
        return res.status(statusCode.CONFLICT).json(
          sendErrorResponse({
            message: `Table number ${tableNumber} is already in use.`,
          })
        );
      }
    }

    hotelTable.tableNumber = tableNumber || hotelTable.tableNumber;
    hotelTable.seats = seats || hotelTable.seats;
    hotelTable.reservationStatus =
      reservationStatus || hotelTable.reservationStatus;
    hotelTable.is_occupied =
      is_occupied !== undefined ? is_occupied : hotelTable.is_occupied;

    await hotelTable.save();

    return res.status(statusCode.OK).json(
      sendSuccessResponse({
        data: hotelTable,
        message: constants.HOTETABLES.UPDATE_SUCCESS,
      })
    );
  } catch (error) {
    logger.error(error.message);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(statusCode.CONFLICT)
        .json(sendErrorResponse({ message: error.message }));
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(statusCode.NOT_FOUND).json(
        sendErrorResponse({
          message: "SuperAdmin ID not found in the database.",
        })
      );
    }

    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: error.message }));
  }
};

const deleteHotelTable = async (req, res) => {
  const { id } = req.params;
  const superAdminId = req.userID;

  try {
    const hotelTable = await hotelTableSchema.findByPk(id);

    if (!hotelTable) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(
          sendErrorResponse({ message: constants.HOTETABLES.DELETE_ERROR })
        );
    }

    if (hotelTable.superAdminId !== superAdminId) {
      return res.status(statusCode.FORBIDDEN).json(
        sendErrorResponse({
          message: "You do not have permission to delete this table.",
        })
      );
    }

    await hotelTable.destroy();

    return res
      .status(statusCode.OK)
      .json(
        sendSuccessResponse({ message: constants.HOTETABLES.DELETE_SUCCESS })
      );
  } catch (error) {
    logger.error(error.message);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: error.message }));
  }
};

module.exports = {
  createHotelTable,
  getAllHotelTables,
  getHotelTableById,
  updateHotelTable,
  deleteHotelTable,
};
