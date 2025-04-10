const joi = require("joi");

module.exports = {
  createUserValidation: joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
    role: joi.string().valid("user", "admin").default("user"),
  }),

  updateUserValidation: joi.object({
    name: joi.string().min(3).max(30),
    email: joi.string().email(),
    role: joi.string().valid("user", "admin"),
  }),
};
