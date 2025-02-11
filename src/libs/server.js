const express = require("express");
const cors = require("cors");
const routes = require("../routes/index");

// Import Utility
const logger = require("./logger");
const { morganMiddleware } = require("./logger");

function createServer() {
  return new Promise((resolve, reject) => {
    try {
      const app = express();

      // Use CORS middleware
      app.use(cors({ credentials: true, origin: "*" }));

      // Use Morgan logging middleware
      app.use(morganMiddleware);

      // Parsing middleware
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());

      // Register routes for the API
      app.use("/api/v1", routes);

      // Default route
      app.get("/", (req, res) => {
        res.send({ message: "Welcome to Hotel Management System" });
      });

      // Resolve the promise with the app
      resolve(app);
    } catch (err) {
      logger.error(err);
      reject(err);
    }
  });
}

module.exports = { createServer };
