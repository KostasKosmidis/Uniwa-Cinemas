const { Router } = require("express");
const { makeInvoker } = require("awilix-express");

const api = makeInvoker(({ authController }) => authController);

const router = Router();

router.post("/register", api("register"));
router.post("/login", api("login"));

module.exports = router;
