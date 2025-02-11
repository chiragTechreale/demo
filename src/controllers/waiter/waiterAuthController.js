const bcrypt = require("bcrypt");
const Waiter = require("../../models/waiter");
const OTP = require("../../models/otp");
const Utils = require("../../libs/utils");
const { createToken } = require("../../libs/jwt");

const waiterAuthController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const waiterUser = await Waiter.findOne({ where: { email } });

      if (!waiterUser) {
        return res
          .status(Utils.statusCode.NOT_FOUND)
          .json(Utils.sendErrorResponse({ message: "Waiter not found." }));
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        waiterUser.password
      );
      if (!isPasswordValid) {
        return res
          .status(Utils.statusCode.UNAUTHORIZED)
          .json(Utils.sendErrorResponse({ message: "Incorrect credentials." }));
      }

      const token = await createToken({
        id: waiterUser.id,
        role: waiterUser.role,
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

      const waiterUser = await Waiter.findOne({ where: { email } });

      if (!waiterUser) {
        return res
          .status(Utils.statusCode.NOT_FOUND)
          .json(Utils.sendErrorResponse({ message: "Waiter not found." }));
      }

      const otp = Utils.generateOTP();

      await OTP.create({
        waiterId: waiterUser.id,
        otp,
        type: "forgot_password",
      });

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
        where: { waiterId: req.userId, otp, type: "forgot_password" },
      });

      if (!otpRecord) {
        return res.status(Utils.statusCode.BAD_REQUEST).json(
          Utils.sendErrorResponse({
            message: "Invalid OTP.",
          })
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await Waiter.update(
        { password: hashedPassword },
        { where: { id: req.userId } }
      );

      await OTP.destroy({ where: { waiterId: req.userId, otp } });

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

  async me(req, res) {
    try {
      const waiterId = req.user.id;

      const waiter = await Waiter.findOne({
        where: { id: waiterId },
        attributes: { exclude: ["password"] },
      });

      if (!waiter) {
        return res
          .status(Utils.statusCode.NOT_FOUND)
          .json(Utils.sendErrorResponse({ message: "Waiter not found." }));
      }

      return res
        .status(Utils.statusCode.OK)
        .json(Utils.sendSuccessResponse({ waiter }));
    } catch (err) {
      console.error(err);
      return res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .json(Utils.sendErrorResponse({ message: "Server error." }));
    }
  },

  async verifyOtp(req, res) {
    try {
      const { otp } = req.body;

      const otpRecord = await OTP.findOne({
        where: { waiterId: req.userId, otp, type: "forgot_password" },
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

  async resendOtp(req, res) {
    try {
      const { email } = req.body;

      const waiterUser = await Waiter.findOne({ where: { email } });

      if (!waiterUser) {
        return res
          .status(Utils.statusCode.NOT_FOUND)
          .json(Utils.sendErrorResponse({ message: "Waiter not found." }));
      }

      const otp = Utils.generateOTP();

      await OTP.create({
        waiterId: waiterUser.id,
        otp,
        type: "forgot_password",
      });

      console.log(`OTP resent: ${otp}`);

      return res
        .status(Utils.statusCode.OK)
        .json(
          Utils.sendSuccessResponse({ message: "OTP resent successfully." })
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
};

module.exports = waiterAuthController;
