const express = require("express");
const { sequelize } = require("./src/models");

const app = express();
app.use(express.json());

// routes
app.get("/", (req, res) => res.send("API is running"));

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});