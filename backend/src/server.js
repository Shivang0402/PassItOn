const app = require("../src/app");
const connectDatabase = require("../database/db.js");

connectDatabase().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
