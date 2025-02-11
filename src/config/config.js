const Joi = require("joi");
const dotenv = require("dotenv");
dotenv.config();

const schema = Joi.object({
  DB_NAME: Joi.string().required().description("Database name is required"),
  DB_USER: Joi.string().required().description("Database user is required"),
  DB_PASSWORD: Joi.string()
    .required()
    .description("Database password is required"),
  DB_HOST: Joi.string().required().description("Database host is required"),
  PORT: Joi.string().required().description("Port is required"),
  JWT_SECRET: Joi.string().required().description("JWT Secret is required"),
})
  .unknown()
  .required();

const { error, value } = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  DB_Name: value.DB_NAME,
  DB_User: value.DB_USER,
  DB_Password: value.DB_PASSWORD,
  DB_Host: value.DB_HOST,
  port: value.PORT || 5000,
  JWT_SECRET: value.JWT_SECRET,
};

module.exports = config;
