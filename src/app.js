const express = require("express");
const cors = require("cors"); // ADD THIS
const { scopePerRequest } = require("awilix-express");
const container = require("./container");

const app = express();

// ADD THIS
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

// Dependency Injection
app.use(scopePerRequest(container));

// routes
app.use("/movies", require("./routes/movieRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/screenings", require("./routes/screeningRoutes"));
app.use("/reservations", require("./routes/reservationRoutes"));

app.get("/", (req, res) => {
    res.send("API is running");
});

module.exports = app;
