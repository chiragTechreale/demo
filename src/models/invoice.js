const { DataTypes } = require("sequelize"); // Import Sequelize DataTypes
const { sequelize } = require("../config/db"); // Import the sequelize instance from the config

const invoiceSchema = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    paymentStatus: {
      type: DataTypes.ENUM("Paid", "Pending", "Failed", "Cancelled"),
      defaultValue: "Pending",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = invoiceSchema;
