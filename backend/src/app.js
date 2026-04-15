const express = require("express");

const app = express();
app.use(express.json());

const connectDatabase = require("../database/db.js");
connectDatabase();

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
