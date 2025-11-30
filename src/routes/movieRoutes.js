const router = require("express").Router();
const controller = require("../controllers/movieController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", auth, isAdmin, controller.create);
router.put("/:id", auth, isAdmin, controller.update);
router.delete("/:id", auth, isAdmin, controller.delete);

module.exports = router;