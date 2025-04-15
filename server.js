const connectDB = require("./configs/db");
const express = require("express");
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
    origin: "https://celadon-unicorn-d9e364.netlify.app/",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());
app.use(express.json());
const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // CSRF token must be accessible by JS
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

app.listen(3000, () => console.log("Server is running on port 3000"));
