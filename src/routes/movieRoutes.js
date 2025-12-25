const { Router } = require("express");
const { makeInvoker } = require("awilix-express");

const router = Router();

const api = makeInvoker((container) => container.movieController);

router.get("/", api("getAll"));
router.get("/:id", api("getOne"));
router.post("/", api("create"));
router.put("/:id", api("update"));
router.delete("/:id", api("delete"));

module.exports = router;
