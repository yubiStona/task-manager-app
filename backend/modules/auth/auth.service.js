require("dotenv").config();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async registerUser(userData) {
    if (await User.findOne({ email: userData.email })) {
      throw new Error("User already exists");
    }

    const newUser = await User.create(userData);
    return newUser;
  },
  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    return user;
  },
  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
  },
};
