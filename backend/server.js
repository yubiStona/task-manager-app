const connectDB = require("./configs/db");
const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const cors = require("cors");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//mongoDB connection
connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(3000, () => console.log("Server is running on port 3000"));
