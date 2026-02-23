const express = require("express");
const { makeInvoker } = require("awilix-express");

const ScreeningController = require("../controllers/screeningController");

const router = express.Router();

const api = makeInvoker(ScreeningController);

router.get("/movie/:movieId", api("getByMovie"));

module.exports = router;