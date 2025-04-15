const express = require("express");
const router = express.Router();
const taskController = require("./task.controller");
const { authenticate, authorizeAdmin } = require("../../midleware/auth");

//admin routes
router.post("/", authenticate, authorizeAdmin, taskController.createTask);
router.get("/", authenticate, authorizeAdmin, taskController.getAllTasks);
router.get(
  "/user/:userId",
  authenticate,
  authorizeAdmin,
  taskController.getTasksByUser
);
router.patch(
  "/:taskId",
  authenticate,
  authorizeAdmin,
  taskController.updateTask
);
router.delete(
  "/:taskId",
  authenticate,
  authorizeAdmin,
  taskController.deleteTask
);

//user routes
router.get("/my-tasks", authenticate, taskController.getMyTasks);
router.get("/:taskId", authenticate, taskController.getTaskById);
router.patch("/:taskId/status", authenticate, taskController.updateTaskStatus);

module.exports = router;
