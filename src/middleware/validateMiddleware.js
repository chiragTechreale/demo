const Joi = require("joi");
const Utils = require("../libs/utils");

const validationMiddleware = {
  validate: (schema) => {
    return (req, res, next) => {
      const validationOptions = {
        errors: {
          wrap: { label: "" },
        },
        abortEarly: false,
      };

      const data = req.method === "GET" ? req.query : req.body;

      schema
        .validateAsync(data, validationOptions)
        .then((result) => {
          req.body = result;
          next();
        })
        .catch((error) => {
          if (error instanceof Joi.ValidationError) {
            res
              .status(422)
              .send({ error: error.details.map((x) => x.message).join(", ") });
          } else {
            next(error);
          }
        });
    };
  },

  schema: {
    // SuperAdmin Validation
    SuperAdminCreate: Joi.object({
      name: Joi.string().trim().required(),
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid("superadmin").required(),
      phoneNumber: Joi.string().optional().allow(""),
    }),

    // Waiter Validation
    WaiterCreate: Joi.object({
      name: Joi.string().trim().required(),
      email: Joi.string().trim().lowercase().email().required(),
      phoneNumber: Joi.string().optional().allow(""),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid("waiter").required(),
    }),

    // Table Validation
    TableCreate: Joi.object({
      tableNumber: Joi.string().trim().required(),
      reservationStatus: Joi.string()
        .valid("reserved", "available")
        .default("available"),
      seats: Joi.number().integer().min(1).required(),
      is_occupied: Joi.boolean().default(false),
    }),
    TableUpdate: Joi.object({
      tableNumber: Joi.string().trim(),
      reservationStatus: Joi.string()
        .valid("reserved", "available")
        .default("available"),
      seats: Joi.number().integer().min(1),
      is_occupied: Joi.boolean().default(false),
    }),

    // Menu Validation
    MenuCreate: Joi.object({
      name: Joi.string().trim().required(),
      category: Joi.string().trim().required(),
      price: Joi.number().min(0).required(),
      description: Joi.string().optional().allow(""),
      isAvailable: Joi.boolean().default(true),
      imageUrl: Joi.array().items(Joi.string().uri()).optional(),
      preparationTime: Joi.number().integer().min(0).optional(),
    }),
    MenuUpdate: Joi.object({
      name: Joi.string().trim(),
      category: Joi.string().trim(),
      price: Joi.number().min(0),
      description: Joi.string().optional().allow(""),
      isAvailable: Joi.boolean().default(true),
      imageUrl: Joi.array().items(Joi.string().uri()).optional(),
      preparationTime: Joi.number().integer().min(0).optional(),
    }),

    // Invoice Validation
    InvoiceCreate: Joi.object({
      orderId: Joi.string().trim().required(),
      paymentStatus: Joi.string()
        .valid("Paid", "Pending", "Failed", "Cancelled")
        .default("Pending"),
      amount: Joi.number().min(0).required(),
      paymentMethod: Joi.string().optional().allow(""),
    }),

    // Order Item Validation
    OrderItemCreate: Joi.object({
      menu_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
    }),

    // Order Validation
    OrderCreate: Joi.object({
      tableId: Joi.string().uuid().required(),
      customer_name: Joi.string().trim().required(),
      customer_mobile: Joi.string().trim().required(),
      status: Joi.string().valid("Pending", "Delivered").default("Pending"),
      items: Joi.array()
        .items(
          Joi.object({
            menu_id: Joi.string().uuid().required(),
            quantity: Joi.number().integer().min(1).required(),
          })
        )
        .min(1)
        .required(),
    }),
    OrderStatus: Joi.object({
      status: Joi.string().valid("Pending", "Delivered").required(),
    }),

    // Auth Operations Validation
    Login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),

    ForgotPassword: Joi.object({
      email: Joi.string().email().required(),
    }),

    ResetPassword: Joi.object({
      otp: Joi.string().length(6).required(),
      newPassword: Joi.string().min(6).required(),
    }),

    ResendOtp: Joi.object({
      email: Joi.string().email().required(),
    }),

    VerifyOtp: Joi.object({
      otp: Joi.string().length(6).required(),
    }),
  },
};

module.exports = validationMiddleware;
