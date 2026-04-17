const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("../routes/auth.routes.js");
const itemRoutes = require("../routes/item.routes.js");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
