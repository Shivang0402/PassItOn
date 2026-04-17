const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("../routes/auth.routes.js");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend")));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
