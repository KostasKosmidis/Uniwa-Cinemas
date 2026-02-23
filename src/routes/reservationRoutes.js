const express = require("express");
const { makeInvoker } = require("awilix-express");
const ReservationController = require("../controllers/reservationController");
const auth = require("../middleware/auth");

const router = express.Router();
const api = makeInvoker(ReservationController);

router.post("/", auth, api("create"));
router.get("/me", auth, api("mine"));
router.delete("/:id", auth, api("deleteMine"));

module.exports = router;