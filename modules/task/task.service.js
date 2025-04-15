const Task = require("../../models/Task");
const User = require("../../models/User");

const createTask = async (taskData, adminId) => {
  //check if useer assidning exists
  const user = await User.findById(taskData.assignedTo);
  if (!user) {
    throw new Error("assigned user not found");
  }
  const task = new Task({ ...taskData, assignedBy: adminId });
  await task.save();

  return task;
};

const getAllTasks = async () => {
  const tasks = await Task.find()
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  if (!tasks || tasks.length === 0) {
    throw new Error("No tasks found");
  }

  return tasks;
};

const getTasksByUser = async (userId) => {
  const tasks = await Task.find({ assignedTo: userId })
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  if (!tasks || tasks.length === 0) {
    throw new Error("No tasks found for this user");
  }
  return tasks;
};

const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");

  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};

const updateTask = async (taskId, updateData) => {
  if (updateData.assignedTo) {
    const user = await User.findById(updateData.assignedTo);
    if (!user) {
      throw new Error("assigned user not found");
    }
  }

  const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name email");
  if (!task) {
    throw new Error("task not found");
  }

  return task;
};

const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new Error("task not found");
  }
  return { message: "Task deleted Successfully" };
};

module.exports = {
  createTask,
  getAllTasks,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
};
