const { DataTypes } = require("sequelize"); // Import Sequelize DataTypes
const { sequelize } = require("../config/db"); // Import the sequelize instance from the config

const orderSchema = sequelize.define("Order", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  waiterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Waiters",
      key: "id",
    },
  },
  tableId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Tables",
      key: "id",
    },
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Delivered"),
    defaultValue: "Pending",
  },
});

module.exports = orderSchema;
