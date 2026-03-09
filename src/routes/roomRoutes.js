const { Router } = require("express");
const { makeInvoker } = require("awilix-express");

const router = Router();
const api = makeInvoker((container) => container.roomController);

router.get("/", api("getAll"));

module.exports = router;