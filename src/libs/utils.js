const logger = require("./logger");
const constants = require("./constant");

const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Sends an error response.
 *
 * @param {object} data - The data for the error response.
 * @returns {object} The error response.
 */
function sendErrorResponse(data) {
  return {
    status: "error",
    ...data,
  };
}

/**
 * Logs and parses the error, returns the message.
 *
 * @param {Error} err - The error object.
 * @returns {string} The error message.
 */
function parseError(err) {
  logger.error(err.stack || err.message);
  return err.message || "An unknown error occurred";
}

/**
 * Get the error message based on the given error.
 * @param {unknown} err - The error object or message.
 * @returns {object} The error message.
 */
function getErrorMsg(err) {
  if (typeof err === "string") {
    logger.error(err);
    return { message: err };
  }
  return { message: parseError(err) };
}

/**
 * Get the appropriate HTTP status code based on the error.
 * @param {unknown} err - The error object or message.
 * @returns {number} The HTTP status code.
 */
function getErrorStatusCode(err) {
  if (typeof err === "string") {
    logger.error(err);
    return statusCode.BAD_REQUEST;
  }

  if (err.name === "ValidationError") return statusCode.UNPROCESSABLE_ENTITY;
  if (err.name === "UnauthorizedError") return statusCode.UNAUTHORIZED;
  if (err.name === "NotFoundError") return statusCode.NOT_FOUND;

  return statusCode.INTERNAL_SERVER_ERROR;
}

/**
 * Sends a success response.
 *
 * @param {object} data - The data for the success response.
 * @returns {object} The success response.
 */
function sendSuccessResponse(data) {
  return {
    status: "success",
    ...data,
    message: data.message || constants.GENERAL.SUCCESS,
  };
}

/**
 * Throws an error and logs it.
 *
 * @param {Error | string} err - The error to throw.
 */
function throwError(err) {
  if (typeof err === "string") {
    logger.error(`Error: ${err}`);
    throw new Error(err);
  } else {
    logger.error(`Error: ${err.message}`, err.stack);
    throw err;
  }
}

/**
 * Generates a secure 6-digit OTP.
 *
 * @returns {string} A 6-digit OTP.
 */
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000)); // Generates a 6-digit OTP
}

module.exports = {
  statusCode,
  sendErrorResponse,
  getErrorMsg,
  getErrorStatusCode,
  sendSuccessResponse,
  throwError,
  generateOTP,
};
