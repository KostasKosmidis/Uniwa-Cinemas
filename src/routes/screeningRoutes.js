const express = require("express");
const { makeInvoker } = require("awilix-express");

const ScreeningController = require("../controllers/screeningController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();
const api = makeInvoker(ScreeningController);

router.get("/", api("getAll"));
router.get("/movie/:movieId", api("getByMovie"));
router.post("/", auth, isAdmin, api("create"));

module.exports = router;