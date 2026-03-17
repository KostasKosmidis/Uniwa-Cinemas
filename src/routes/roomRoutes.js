const { Router } = require("express");
const { makeInvoker } = require("awilix-express");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = Router();
const api = makeInvoker((container) => container.roomController);

router.get("/", api("getAll"));
router.post("/", auth, isAdmin, api("create"));
router.put("/:id", auth, isAdmin, api("update"));
router.delete("/:id", auth, isAdmin, api("delete"));

module.exports = router;