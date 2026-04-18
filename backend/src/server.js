require("dotenv").config();
const app = require("../src/app");
const connectDatabase = require("../database/db.js");

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
