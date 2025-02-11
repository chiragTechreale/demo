const config = require("./config");

module.exports = {
  secret: config.JWT_SECRET,
  signOptions: {
    expiresIn: "24h",
    algorithm: "HS256",
  },
};
