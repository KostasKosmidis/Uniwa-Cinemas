const express = require("express");
const { scopePerRequest } = require("awilix-express");
const container = require("./container");

const app = express();

app.use(express.json());

// 🔑 Dependency Injection
app.use(scopePerRequest(container));

// routes
app.use("/movies", require("./routes/movieRoutes"));
app.use("/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
    res.send("API is running");
});

module.exports = app;
