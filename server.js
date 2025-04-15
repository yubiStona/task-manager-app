const connectDB = require("./configs/db");
const express = require("express");
require("dotenv").config();
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const taskRoutes = require("./modules/task/task.routes");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const app = express();
//middleware
app.use(
  cors({
    origin: ["https://taskyb.netlify.app", "http://localhost:5173"], // Allow localhost for testing
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

const csrfProtection = csrf({
  cookie: {
    httpOnly: false,
    sameSite: "None",
    secure: true,
  },
});

app.use(csrfProtection);
//mongoDB connection
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//Apply CSRF protection to all routes except the token endpoint
app.get("/api/csrf-token", (req, res) => {
  try {
    const token = req.csrfToken();
    console.log("Generated CSRF token:", token);
    res.json({ csrfToken: token });
  } catch (err) {
    console.error("Error generating CSRF token:", err);
    res.status(500).json({ error: "Failed to generate CSRF token" });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
