const AdminUser = require("../models/admin");
const logger = require("./logger");

class AppUtils {
  // Initialize the app data
  async init() {
    try {
      // Check if an admin user already exists
      const adminUser = await AdminUser.findOne({});

      if (!adminUser) {
        // If no admin user exists, create one
        const admin = new AdminUser({
          name: "admin",
          email: "admin@yopmail.com",
          password: "admin@123",
        });

        // Save the new admin user
        await admin.save();
        logger.info("Admin User Created");
      }

      logger.info("App data initialized");
    } catch (err) {
      logger.error("Error during app initialization:", err);
    }
  }
}

module.exports = new AppUtils(); // Export the instance of the class
