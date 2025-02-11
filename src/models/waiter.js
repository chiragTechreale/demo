const { DataTypes } = require("sequelize"); // Import Sequelize DataTypes
const { sequelize } = require("../config/db"); // Import the sequelize instance from the config

// Define the Waiter model
const Waiter = sequelize.define(
  "Waiter",
  {
    id: {
      type: DataTypes.UUID, // Use UUID type for the primary key
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDv4
      primaryKey: true, // Set this field as the primary key
    },
    name: {
      type: DataTypes.STRING, // Data type for name
      allowNull: false, // Name cannot be null
    },
    email: {
      type: DataTypes.STRING, // Data type for email
      allowNull: false, // Email cannot be null
      unique: true, // Email should be unique
    },
    phoneNumber: {
      type: DataTypes.STRING, // Data type for phone number
      allowNull: true, // Phone number is optional
    },
    password: {
      type: DataTypes.STRING, // Data type for password
      allowNull: false, // Password cannot be null
    },
    role: {
      type: DataTypes.STRING, // Data type for role
      allowNull: false, // Role cannot be null
      defaultValue: "waiter", // Default value for the role is 'waiter'
    },
    superAdminId: {
      type: DataTypes.UUID, // Use UUID type for the foreign key
      allowNull: false, // This field is required
      references: {
        model: "SuperAdmins", // Foreign key references the SuperAdmins table
        key: "id", // Referencing the id column in the SuperAdmins table
      },
    },
  },
  {
    timestamps: true, // Enable timestamps for the model (createdAt, updatedAt)
  }
);

module.exports = Waiter; // Export the Waiter model
