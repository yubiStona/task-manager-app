const taskService = require("./task.service");
const {
  createTaskValidation,
  updateTaskValidation,
} = require("./task.validation");
const createTask = async (req, res) => {
  try {
    const { error } = createTaskValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    if (err.message.includes("No tasks found")) {
      return res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Error retrieving tasks",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.taskId);
    res.status(200).json(task);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const task = await taskService.getTasksByUser(req.params.userId);
    res.status(200).json(task);
  } catch (err) {
    if (err.message.includes("No tasks found")) {
      return res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Error retrieving tasks",
    });
  }
};
const getMyTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByUser(req.user.id);
    res.status(200).json(tasks);
  } catch (err) {
    if (err.message.includes("No tasks found")) {
      return res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Error retrieving tasks",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { error } = updateTaskValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }
    const task = await taskService.updateTask(req.params.taskId, req.body);
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { error } = updateTaskValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }
    const task = await taskService.updateTask(req.params.taskId, {
      status: req.body.status,
    });
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.taskId);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  getTasksByUser,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
