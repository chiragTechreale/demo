const bcrypt = require("bcrypt");
const SuperAdmin = require("../../models/admin");
const OTP = require("../../models/otp");
const Utils = require("../../libs/utils");
const { createToken } = require("../../libs/jwt");

const adminController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const adminUser = await SuperAdmin.findOne({ where: { email } });
      console.log("admin---->", adminUser);

      if (!adminUser) {
        return res
          .status(Utils.statusCode.NOT_FOUND)
          .json(Utils.sendErrorResponse({ message: "User not found." }));
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        adminUser.password
      );
      if (!isPasswordValid) {
        return res
          .status(Utils.statusCode.UNAUTHORIZED)
          .json(Utils.sendErrorResponse({ message: "Incorrect credentials." }));
      }

      const token = await createToken({
        id: adminUser.id,
        role: adminUser.role,
      });

      return res
        .status(Utils.statusCode.OK)
        .json(Utils.sendSuccessResponse({ token }));
    } catch (err) {
      console.error(err);
      return res.status(Utils.statusCode.INTERNAL_SERVER_ERROR).json(
        Utils.sendErrorResponse({
          message: "Internal server error.",
        })
      );
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const adminUser = await SuperAdmin.findOne({ where: { email } });

      if (!adminUser) {
        return res
          .status(Utils.statusCode.NOT_FOUND)
          .json(Utils.sendErrorResponse({ message: "User not found." }));
      }

      const otp = Utils.generateOTP();

      // Save OTP to the database
      await OTP.create({ adminId: adminUser.id, otp, type: "forgot_password" });

      console.log(`OTP sent: ${otp}`);

      return res
        .status(Utils.statusCode.OK)
        .json(
          Utils.sendSuccessResponse({ message: "OTP sent successfully.", otp })
        );
    } catch (err) {
      console.error(err);
      return res.status(Utils.statusCode.INTERNAL_SERVER_ERROR).json(
        Utils.sendErrorResponse({
          message: "Internal server error.",
        })
      );
    }
  },

  async resetPassword(req, res) {
    try {
      const { otp, newPassword } = req.body;

      const otpRecord = await OTP.findOne({
        where: { adminId: req.userId, otp, type: "forgot_password" },
      });

      if (!otpRecord) {
        return res.status(Utils.statusCode.BAD_REQUEST).json(
          Utils.sendErrorResponse({
            message: "Invalid OTP.",
          })
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await SuperAdmin.update(
        { password: hashedPassword },
        { where: { id: req.userId } }
      );

      await OTP.destroy({ where: { adminId: req.userId, otp } });

      return res
        .status(Utils.statusCode.OK)
        .json(
          Utils.sendSuccessResponse({ message: "Password reset successfully." })
        );
    } catch (err) {
      console.error(err);
      return res.status(Utils.statusCode.INTERNAL_SERVER_ERROR).json(
        Utils.sendErrorResponse({
          message: "Internal server error.",
        })
      );
    }
  },

  async verifyOtp(req, res) {
    try {
      const { otp } = req.body;

      const otpRecord = await OTP.findOne({
        where: { adminId: req.userId, otp, type: "forgot_password" },
      });

      if (!otpRecord) {
        return res.status(Utils.statusCode.BAD_REQUEST).json(
          Utils.sendErrorResponse({
            message: "Invalid OTP.",
          })
        );
      }

      return res
        .status(Utils.statusCode.OK)
        .json(
          Utils.sendSuccessResponse({ message: "OTP verified successfully." })
        );
    } catch (err) {
      console.error(err);
      return res.status(Utils.statusCode.INTERNAL_SERVER_ERROR).json(
        Utils.sendErrorResponse({
          message: "Internal server error.",
        })
      );
    }
  },

  // New method to resend OTP
  async resendOtp(req, res) {
    try {
      const { email } = req.body;

      const adminUser = await SuperAdmin.findOne({ where: { email } });

      if (!adminUser) {
        return res
          .status(Utils.statusCode.NOT_FOUND)
          .json(Utils.sendErrorResponse({ message: "User not found." }));
      }

      // Destroy all old OTPs for this user
      await OTP.destroy({
        where: { adminId: adminUser.id, type: "forgot_password" },
      });

      // Generate a new OTP using the utility function
      const otp = Utils.generateOTP();

      // Save the new OTP to the database
      await OTP.create({
        adminId: adminUser.id,
        otp,
        type: "forgot_password",
      });

      console.log(`OTP resent: ${otp}`);

      // Return the OTP (Again, this is for demonstration purposes only)
      return res.status(Utils.statusCode.OK).json(
        Utils.sendSuccessResponse({
          message: "OTP resent successfully.",
          otp, // You may want to exclude this in production
        })
      );
    } catch (err) {
      console.error(err);
      return res.status(Utils.statusCode.INTERNAL_SERVER_ERROR).json(
        Utils.sendErrorResponse({
          message: "Internal server error.",
        })
      );
    }
  },
  async me(req, res) {
    try {
      const adminId = req.user.id; // Get admin ID from the authenticated user

      // Fetch admin details excluding the password field
      const admin = await SuperAdmin.findOne({
        where: { id: adminId },
        attributes: { exclude: ["password"] }, // Exclude password field
      });

      if (!admin) {
        return res.status(Utils.statusCode.NOT_FOUND).json(
          Utils.sendErrorResponse({
            message: constants.GENERAL.NOT_FOUND || "User not found.",
          })
        );
      }

      return res
        .status(Utils.statusCode.OK)
        .json(Utils.sendSuccessResponse({ admin }));
    } catch (err) {
      console.error(err);
      return res.status(Utils.statusCode.INTERNAL_SERVER_ERROR).json(
        Utils.sendErrorResponse({
          message: constants.GENERAL.INTERNAL_SERVER_ERROR || "Server error.",
        })
      );
    }
  },
};

module.exports = adminController;
