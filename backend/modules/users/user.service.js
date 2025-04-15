const User = require("../../models/User");
const bcrypt=require('bcryptjs');

const createUser = async (userData) => {
  //check if there is user alreay with the same email
  if (await User.findOne({ email: userData.email })) {
    throw new Error("User already exists");
  }
  //create new user
  const newUser = await User.create(userData);
  return newUser;
};

const getAllUsers = async () => {
  return await User.find().select("-password");
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUser = async (userId, updateData) => {
  if (updateData.email && 
    await User.findOne({ email: updateData.email, _id: { $ne: userId } })) {
  throw new Error("Email already in use");
}

// If password is being updated, hash it
if (updateData.password) {
  const salt = await bcrypt.genSalt(10);
  updateData.password = await bcrypt.hash(updateData.password, salt);
}

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const deleteUser = async (userId) => {
  const use = await User.findByIdAndDelete(userId);
  if (!use) {
    throw new Error("User not found");
  }
  return { message: "user deleted successfully" };
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
