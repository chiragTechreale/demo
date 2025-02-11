const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const OTP = sequelize.define(
  "OTP",
  {
    adminId: {
      type: DataTypes.UUID,

      references: {
        model: "SuperAdmins", // Assuming the admin table is called "admins"
        key: "id", // Foreign key referring to the primary key of the "admins" table
      },
    },
    waiterId: {
      type: DataTypes.UUID,

      references: {
        model: "Waiters", // Assuming the waiter table is called "waiters"
        key: "id", // Foreign key referring to the primary key of the "waiters" table
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["forgot_password", "resend_otp"]], // Validate OTP type
      },
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createAt", // Sequelize will use this name in the DB column
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "otps",
    indexes: [
      {
        fields: ["adminId", "waiterId"], // Index on foreign keys
      },
    ],
    hooks: {
      beforeCreate: (otp) => {
        // Automatically set an expiration time of 900 seconds (15 minutes)
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + 900);
        otp.createAt = expirationDate;
      },
    },
  }
);
module.exports = OTP;
