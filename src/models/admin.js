const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcrypt");

const SuperAdmin = sequelize.define(
  "SuperAdmin",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "superadmin",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (superAdmin) => {
        if (superAdmin.password) {
          const hashedPassword = await bcrypt.hash(superAdmin.password, 10);
          superAdmin.password = hashedPassword;
        }
      },
      beforeUpdate: async (superAdmin) => {
        if (superAdmin.password) {
          const hashedPassword = await bcrypt.hash(superAdmin.password, 10);
          superAdmin.password = hashedPassword;
        }
      },
    },
  }
);

module.exports = SuperAdmin;
