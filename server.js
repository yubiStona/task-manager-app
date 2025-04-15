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
    origin: ["https://taskyb.netlify.app", "http://localhost:3000"], // Allow localhost for testing
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// CSRF Protection setup
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  ignoreMethods: ["GET", "HEAD", "OPTIONS"],
  value: (req) => {
    return (
      req.headers["x-csrf-token"] ||
      (req.body && req.body._csrf) ||
      (req.query && req.query._csrf)
    );
  },
});

// Custom error handler for CSRF errors
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.error("CSRF Error:", {
      path: req.path,
      headers: req.headers,
      cookies: req.cookies,
      body: req.body,
    });
    return res.status(403).json({
      error: "CSRF token validation failed",
      message: "Form has been tampered with or session expired",
    });
  }
  next(err);
});

// Apply CSRF protection to all routes except the token endpoint
app.get("/api/csrf-token", (req, res) => {
  try {
    const token = req.csrfToken();
    console.log("Generated CSRF token:", token);
    console.log("Cookies set:", res.getHeaders()["set-cookie"]);
    res.json({ csrfToken: token });
  } catch (err) {
    console.error("Error generating CSRF token:", err);
    res.status(500).json({ error: "Failed to generate CSRF token" });
  }
});

app.use(csrfProtection);
//mongoDB connection
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(3000, () => console.log("Server is running on port 3000"));
