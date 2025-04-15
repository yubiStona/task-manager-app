const joi = require("joi");
const { objectId } = require("../../utils/customValidations");

module.exports = {
  createTaskValidation: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    status: joi
      .string()
      .valid("todo", "in-progress", "completed")
      .default("todo"),
    assignedTo: joi.string().custom(objectId).required(),
  }),

  updateTaskValidation: joi.object({
    title: joi.string(),
    description: joi.string(),
    status: joi
      .string()
      .valid("todo", "in-progress", "completed")
      .default("todo"),
    assignedTo: joi.string().custom(objectId),
  }).unknown(true),
  getTaskValidation: {
    params: joi.object({
      taskId: joi.string().custom(objectId).required(),
    }),
  },
};
