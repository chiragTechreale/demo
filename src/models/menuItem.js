const { DataTypes } = require("sequelize"); // Import Sequelize DataTypes
const { sequelize } = require("../config/db"); // Import the sequelize instance from the config

const menuItemSchema = sequelize.define(
  "Menu",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imageUrl: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    preparationTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    superAdminId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "SuperAdmins",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["name", "category"],
      },
    ],
  }
);

module.exports = menuItemSchema;
