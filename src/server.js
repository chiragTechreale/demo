const logger = require("./libs/logger");
const config = require("./config/config");
const ServerUtils = require("./libs/server");
const DBUtils = require("./config/db");
const AppUtils = require("./libs/app");

(async () => {
  try {
    // Connect to the database
    await DBUtils.connect();

    // Initialize application-related settings
    await AppUtils.init();

    // Start the server
    const app = await ServerUtils.createServer();
    const PORT = config.PORT || 3000;

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Error occurred during application startup: ", err);
  }
})();

//First Point
// response Formate
// json:{
//   status:"success" // if success or else error,
//   message:"add a success message according to api",// for example data fetched successfully, user registered successfully etc.
//   data:[{}]
// }

// second point
// => R&D on bcrypt
// => apply bcrypt on all the password fields

// use multer to add image // suggestions
