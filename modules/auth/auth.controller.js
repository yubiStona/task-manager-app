const authService = require("./auth.service");
const jwt = require("jsonwebtoken");
const { loginValidation, registerValidation } = require("./auth.validation");

exports.register = async (req, res, next) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      // data: { user },
    });
  } catch (err) {
    if (err.message.includes("User already exists")) {
      return res.status(409).json({
        status: "fail",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log("Login request received");
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }
    const user = await authService.loginUser(req.body);
    const token = authService.generateToken(user);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //send jwt as httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    if (err.message.includes("Invalid email or password")) {
      return res.status(401).json({
        status: "fail",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
