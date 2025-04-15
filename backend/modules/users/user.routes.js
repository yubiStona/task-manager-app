const express = require("express");
const router = express.Router();
const userConrtroller = require("./user.controller");
const { authenticate, authorizeAdmin } = require("../../midleware/auth");

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  userConrtroller.createUser
);

router.get("/", authenticate, authorizeAdmin, userConrtroller.getAllUsers);
router.get(
  "/:userId",
  authenticate,
  authorizeAdmin,
  userConrtroller.getUserById
);

router.patch(
  "/:userId",
  authenticate,
  authorizeAdmin,
  userConrtroller.updateUser
);
router.delete(
  "/:userId",
  authenticate,
  authorizeAdmin,
  userConrtroller.deleteUser
);
module.exports = router;
