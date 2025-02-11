const { Sequelize } = require("sequelize");
const config = require("../config/config");
const logger = require("../libs/logger");

const sequelize = new Sequelize(
  config.DB_Name,
  config.DB_User,
  config.DB_Password,
  {
    host: config.DB_Host,
    dialect: "mysql",
  }
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established");

    // Sync the models with the database
    await sequelize.sync({ force: false });
    logger.info("Database synced successfully");
  } catch (err) {
    logger.error("Error connecting to the database:", err);
  }
};

module.exports = {
  connect,
  sequelize,
};
